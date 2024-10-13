'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  text: string;
  isUser: boolean;
}

export default function MentalHealthPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Mental Health Support</h1>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
        <div className="mb-4 h-96 overflow-y-auto border border-gray-300 rounded p-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {message.text}
              </span>
            </div>
          ))}
          {isLoading && <div className="text-center">Thinking...</div>}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l"
            placeholder="Type your message here..."
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-2 rounded-r"
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}