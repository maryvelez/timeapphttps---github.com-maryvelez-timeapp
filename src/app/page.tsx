"use client";

import Link from 'next/link';
import { Inter } from 'next/font/google';
import workingPeopleImage from '@/assets/images/workingpeople.jpg'; // Import the image

// Load Inter font
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <div
      className={`flex min-h-screen items-center justify-center relative overflow-hidden ${inter.className}`}
      style={{ backgroundColor: 'white' }}
    >
      <div className="text-center text-black z-10" style={{ paddingTop: '100px' }}> {/* Inline style for 100px top padding */}
        <h2 className="text-2xl font-light mb-8">
          Increase your performance, get better every day.
        </h2>
        <h1 className="text-6xl font-extrabold mb-10">oro</h1>
        <div className="flex flex-col space-y-6">
          <Link
            href="/auth/login"
            className="bg-black text-white py-3 px-6 max-w-xs mx-auto rounded-[15px] text-lg font-semibold shadow-lg hover:shadow-2xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="text-black py-3 px-6 max-w-xs mx-auto rounded-[15px] text-lg font-semibold shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
        {/* Add the image here */}
        <img
          src={workingPeopleImage.src}
          alt="Working People"
          className="mt-10 max-w-full h-auto rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}
