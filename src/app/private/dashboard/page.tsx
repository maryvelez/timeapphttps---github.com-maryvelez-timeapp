'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

const navigation = [
  { name: 'Personal', href: '#', current: true },
  { name: 'Tasks', href: '/private/dashboard/tasks', current: false },
  { name: 'Locked In', href: '/private/dashboard/locked_in', current: false },
  { name: 'Mind', href: '/private/dashboard/mental-health', current: false },
];

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface Goal {
  id: number;
  season: number;
  goal: string;
}

const SEASONS = ['Fall', 'Spring', 'Summer'];
const START_YEAR = 2024;

function getSeasonYear(seasonNumber: number): { season: string; year: number } {
  const yearOffset = Math.floor((seasonNumber - 1) / 3);
  const seasonIndex = (seasonNumber - 1) % 3;
  
  return {
    season: SEASONS[seasonIndex],
    year: START_YEAR + yearOffset
  };
}

function getSeasonNumber(year: number, season: string): number {
  const yearOffset = year - START_YEAR;
  const seasonIndex = SEASONS.indexOf(season);
  return yearOffset * 3 + seasonIndex + 1;
}

function getSeasonYearLabel(seasonNumber: number): string {
  const { season, year } = getSeasonYear(seasonNumber);
  return `${season} ${year}`;
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({ season: 1, goal: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  async function fetchGoals() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('five_year_plan')
        .select('*')
        .eq('user_id', user.id)
        .order('season', { ascending: true });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      setError('Error fetching goals: ' + error.message);
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!newGoal.goal.trim()) {
      setError('Please enter a goal');
      return;
    }
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('five_year_plan')
        .insert([{ 
          user_id: user.id,
          season: newGoal.season,
          goal: newGoal.goal.trim() 
        }])
        .select();

      if (error) throw error;

      console.log('Goal added successfully:', data);
      setSuccessMessage('Submitted');
      setGoals([...goals, data[0]]);
      setNewGoal({ season: 1, goal: '' });
      setError(null);
    } catch (error: any) {
      console.error('Error adding goal:', error.message, error.details, error.hint);
      setError(`Failed to add goal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function updateGoal(id: number, updatedGoal: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('five_year_plan')
        .update({ goal: updatedGoal })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setGoals(goals.map(goal => goal.id === id ? { ...goal, goal: updatedGoal } : goal));
    } catch (error: any) {
      setError('Error updating goal: ' + error.message);
      console.error('Error updating goal:', error);
    }
  }

  async function deleteGoal(id: number) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('five_year_plan')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setGoals(goals.filter(goal => goal.id !== id));
    } catch (error: any) {
      setError('Error deleting goal: ' + error.message);
      console.error('Error deleting goal:', error);
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div className="flex h-screen bg-[#F0F4F8]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 bg-[#5B7083] text-white`}>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">ORO</h2>
          <nav>
            <ul>
              {navigation.map((item) => (
                <li key={item.name} className="mb-2">
                  <a
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-[#7999B6] text-white' : 'text-[#E1E8ED] hover:bg-[#7999B6] hover:text-white',
                      'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
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
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-[#5B7083]">
              <div className="w-6 h-6 flex flex-col justify-around">
                <div className="w-full h-0.5 bg-current"></div>
                <div className="w-full h-0.5 bg-current"></div>
                <div className="w-full h-0.5 bg-current"></div>
              </div>
            </button>
            <div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-[#7999B6] text-white py-2 px-4 rounded-lg hover:bg-[#5B7083] transition-all duration-200 text-sm mr-2"
              >
                {isEditing ? 'View Plan' : 'Edit Plan'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-[#5B7083] text-white py-2 px-4 rounded-lg hover:bg-[#7999B6] transition-all duration-200 text-sm"
              >
                Log out
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto p-4">
          {isEditing ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-[#2C3E50]">Edit Your 5-Year Plan</h2>
              
              {/* Display existing goals */}
              {goals.map((goal) => (
                <div key={goal.id} className="mb-4 p-3 bg-[#E1E8ED] rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#5B7083]">{getSeasonYearLabel(goal.season)}</span>
                    <button onClick={() => deleteGoal(goal.id)} className="text-red-500 hover:text-red-700">Delete</button>
                  </div>
                  <input
                    type="text"
                    value={goal.goal}
                    onChange={(e) => updateGoal(goal.id, e.target.value)}
                    className="mt-2 w-full p-2 border rounded"
                  />
                </div>
              ))}

              {/* Form to add new goal */}
              <form onSubmit={addGoal} className="mt-6">
                <div className="flex flex-col gap-4">
                  <select
                    value={newGoal.season}
                    onChange={(e) => setNewGoal({ ...newGoal, season: parseInt(e.target.value) })}
                    className="p-2 border rounded"
                  >
                    {[...Array(15)].map((_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {getSeasonYearLabel(index + 1)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newGoal.goal}
                    onChange={(e) => setNewGoal({ ...newGoal, goal: e.target.value })}
                    placeholder="Enter new goal"
                    className="flex-grow p-2 border rounded"
                  />
                  <button 
                    type="submit" 
                    className="bg-[#7999B6] text-white px-4 py-2 rounded hover:bg-[#5B7083] disabled:bg-gray-400"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Goal'}
                  </button>
                </div>
              </form>
              {error && <p className="mt-2 text-red-500">{error}</p>}
              {successMessage && <p className="mt-2 text-green-500">{successMessage}</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 5-Year Plan Overview */}
              <div className="bg-white rounded-lg shadow-md p-4 md:col-span-2">
                <h2 className="text-xl font-bold mb-3 text-[#2C3E50]">Your 5-Year Plan</h2>
                <div className="flex flex-wrap">
                  {goals.map((goal) => (
                    <div key={goal.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2">
                      <div className="bg-[#E1E8ED] rounded-lg p-3 h-full flex flex-col justify-between">
                        <div className="text-[#5B7083] font-bold mb-2">{getSeasonYearLabel(goal.season)}</div>
                        <div className="text-sm text-[#34495E]">{goal.goal}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Focus */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold mb-2 text-[#2C3E50]">Current Focus</h3>
                <p className="text-[#34495E] text-sm">
                  {goals.length > 0
                    ? `Focus on your ${getSeasonYearLabel(goals[0].season)} goal: ${goals[0].goal || "Set a goal for this season!"}`
                    : "Set your goals to see your current focus!"}
                </p>
              </div>

              {/* Progress Visualization */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold mb-2 text-[#2C3E50]">Overall Progress</h3>
                <div className="w-full bg-[#E1E8ED] rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-[#7999B6] h-2.5 rounded-full" 
                    style={{ width: `${(goals.length / 15) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[#34495E] text-sm">
                  You've set {goals.length} out of 15 seasonal goals!
                </p>
              </div>

              {/* Inspirational Quote */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold mb-2 text-[#2C3E50]">Daily Inspiration</h3>
                <blockquote className="text-[#34495E] text-sm italic">
                  "The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt
                </blockquote>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}