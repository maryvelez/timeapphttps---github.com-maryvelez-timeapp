"use client";

import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const createDots = () => {
      const body = document.body;
      for (let i = 0; i < 30; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        body.appendChild(dot);
      }
    };
    createDots();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black relative overflow-hidden">
      <div className="text-center text-white z-10">
      <h2 className="text-2xl font-extrabold mb-10">welcome to</h2>

        <h1 className="text-9xl font-extrabold mb-10">ORO</h1>
        <div className="space-y-12"> 
          <Link
            href="/auth/login"
            className="bg-white m-[1em] text-black py-3 px-8 rounded-[10px] text-lg font-semibold shadow-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="bg-white m-[1em] text-black py-3 px-8 rounded-[10px] text-lg font-semibold shadow-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
