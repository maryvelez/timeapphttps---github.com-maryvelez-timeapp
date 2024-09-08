// src/app/private/dashboard/page.tsx

"use client"; // Add this at the top to mark the component as a Client Component

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [showButtons, setShowButtons] = useState(false);

  const handleButtonClick = () => {
    setShowButtons(!showButtons);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="relative">
        <button
          onClick={handleButtonClick}
          className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-12 w-12" aria-hidden="true" />
        </button>

        {showButtons && (
          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col space-y-4">
            <button className="bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Button 1
            </button>
            <button className="bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              Button 2
            </button>
            <button className="bg-yellow-500 text-white py-2 px-4 rounded shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
              Button 3
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
