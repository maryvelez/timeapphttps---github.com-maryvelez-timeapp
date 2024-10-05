'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Documents', href: '#', current: false },
  { name: 'Reports', href: '#', current: false },
];

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface PostgresChangePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: any;
  old: any;
}

interface Task {
  id: number;
  user_id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

export default function TaskDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload: PostgresChangePayload) => {
          console.log('Change received!', payload);
          handleTaskChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleTaskChange = (payload: PostgresChangePayload) => {
    if (payload.eventType === 'INSERT') {
      setTasks((prevTasks) => [...prevTasks, payload.new]);
    } else if (payload.eventType === 'UPDATE') {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === payload.new.id ? payload.new : task))
      );
    } else if (payload.eventType === 'DELETE') {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== payload.old.id));
    }
  };

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data || []);
      }
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      router.push('/auth/login');
    }
  };

  const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Create a new task object
        const newTaskObject: Omit<Task, 'id'> = {
          user_id: user.id,
          text: newTask,
          completed: false,
          created_at: new Date().toISOString()
        };

        // Update local state immediately
        setTasks(prevTasks => [...prevTasks, { ...newTaskObject, id: Date.now() }]);
        setNewTask('');

        // Send to Supabase
        const { data, error } = await supabase
          .from('tasks')
          .insert([newTaskObject])
          .select();
        
        if (error) {
          console.error('Error adding task:', error);
          // Optionally, remove the task from local state if it failed to save
          setTasks(prevTasks => prevTasks.filter(task => task.text !== newTask));
        } else if (data) {
          // Update the temporary ID with the real one from the database
          setTasks(prevTasks => prevTasks.map(task => 
            task.text === newTask ? data[0] : task
          ));
        }
      }
    }
  };

  const toggleTask = async (id: number) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (taskToUpdate) {
      // Optimistically update local state
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === id ? {...task, completed: !task.completed} : task
      ));

      const { error } = await supabase
        .from('tasks')
        .update({ completed: !taskToUpdate.completed })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating task:', error);
        // Revert the change if there was an error
        setTasks(prevTasks => prevTasks.map(task => 
          task.id === id ? taskToUpdate : task
        ));
      }
    }
  };

  const removeTask = async (id: number) => {
    // Optimistically remove from local state
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error removing task:', error);
      // If there was an error, fetch tasks again to ensure consistency
      fetchTasks();
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completedPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 bg-gray-800 text-white`}>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">ORO</h2>
          <nav>
            <ul>
              {navigation.map((item) => (
                <li key={item.name} className="mb-2">
                  <a
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block px-3 py-2 rounded-md text-base font-medium'
                    )}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow">
          <div className="px-4 py-2 flex justify-between items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <div className="w-6 h-6 flex flex-col justify-around">
                <div className="w-full h-0.5 bg-gray-600"></div>
                <div className="w-full h-0.5 bg-gray-600"></div>
                <div className="w-full h-0.5 bg-gray-600"></div>
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sm"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto p-4">
          {/* Task input and list */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Tasks</h2>
            <form onSubmit={addTask} className="mb-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Add Task
              </button>
            </form>
            <ul>
              {tasks.map(task => (
                <li key={task.id} className="flex items-center justify-between mb-2 bg-white p-2 rounded shadow">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="mr-2"
                    />
                    <span className={task.completed ? 'line-through' : ''}>{task.text}</span>
                  </div>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Task completion visualizations */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Task Completion</h3>
            
            {/* Progress bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${completedPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span>Completed: {completedTasks}</span>
                <span>Total: {totalTasks}</span>
              </div>
            </div>

            {/* Pie chart */}
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 32 32">
                  <circle 
                    className="text-gray-200" 
                    strokeWidth="4" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="14" 
                    cx="16" 
                    cy="16" 
                  />
                  <circle 
                    className="text-blue-600" 
                    strokeWidth="4" 
                    strokeDasharray={`${completedPercentage} 100`}
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="14" 
                    cx="16" 
                    cy="16" 
                  />
                </svg>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
                  {Math.round(completedPercentage)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}