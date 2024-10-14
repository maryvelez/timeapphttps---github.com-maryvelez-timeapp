'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import axios from 'axios';

const navigation = [
  { name: 'Personal', href: '/private/dashboard', current: false },
  { name: 'Daily', href: '/private/dashboard/tasks', current: false },
  { name: 'Locked In', href: '/private/dashboard/locked_in', current: false },
  { name: 'Mind', href: '/private/dashboard/mental-health', current: true },
];

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface Message {
  text: string;
  isUser: boolean;
}

export default function MentalHealthPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      router.push('/auth/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/mental-health-chat', { message: input });
      const botMessage: Message = { text: response.data.reply, isUser: false };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching reply:', error);
      const errorMessage: Message = { text: 'Sorry, I encountered an error. Please try again.', isUser: false };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#E6F3FF]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 bg-[#FFF0F5] text-[#6B8E23]`}>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">ORO</h2>
          <nav>
            <ul>
              {navigation.map((item) => (
                <li key={item.name} className="mb-2">
                  <a
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-[#B0E0E6] text-[#4682B4]' : 'text-[#6B8E23] hover:bg-[#B0E0E6] hover:text-[#4682B4]',
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
        <div className="bg-[#F0FFF0] shadow">
          <div className="px-4 py-2 flex justify-between items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-[#6B8E23]">
              <div className="w-6 h-6 flex flex-col justify-around">
                <div className="w-full h-0.5 bg-current"></div>
                <div className="w-full h-0.5 bg-current"></div>
                <div className="w-full h-0.5 bg-current"></div>
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#B0E0E6] text-[#4682B4] py-2 px-4 rounded-lg hover:bg-[#87CEEB] transition-all duration-200 text-sm"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6">
            <h1 className="text-2xl font-bold mb-4 text-[#4682B4]">Mind and me</h1>
            <p className="  mb-4 text-[#4682B4]">talk about your thoughts or bounce back ideas</p>
            <div className="mb-4 h-96 overflow-y-auto border border-[#B0E0E6] rounded-lg p-4">
              {messages.map((message, index) => (
                <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-[#E6E6FA] text-[#4B0082]' : 'bg-[#F0FFF0] text-[#2E8B57]'}`}>
                    {message.text}
                    {!message.isUser && message.text.includes("ementalhealth.ca") && (
                      <div className="text-xs mt-1 text-[#4682B4]">Source: ementalhealth.ca</div>
                    )}
                  </span>
                </div>
              ))}
              {isLoading && <div className="text-center text-[#4682B4]">Thinking...</div>}
            </div>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow p-2 border border-[#B0E0E6] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                placeholder="Type your message here..."
              />
              <button 
                type="submit" 
                className="bg-[#B0E0E6] text-[#4682B4] p-2 rounded-r-lg hover:bg-[#87CEEB] transition-colors duration-200"
                disabled={isLoading}
              >
                Send
              </button>

            </form>
            <p className="  mb-4 text-[#4682B4]">information from ementalhealth.ca</p>

          </div>
        </div>
      </div>
    </div>
  );
}