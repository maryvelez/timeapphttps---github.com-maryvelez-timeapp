'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Documents', href: '#', current: false },
  { name: 'Reports', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function TaskDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const router = useRouter();

  const handleLogout = () => {
    // Here you would typically clear any authentication tokens or user data
    // For example: localStorage.removeItem('token');
    
    console.log('Logging out...');
    
    // Redirect to the login page
    router.push('/auth/login');
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  const completedPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 bg-gray-800 text-white`}>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Task Manager</h2>
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