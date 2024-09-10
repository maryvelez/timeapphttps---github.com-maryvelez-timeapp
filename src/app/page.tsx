"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const createDots = () => {
      const newDots = [];
      for (let i = 0; i < 30; i++) {
        newDots.push({ id: i });
      }
      setDots(newDots);
    };
    createDots();
  }, []);

  return (
    <div
      className="flex min-h-screen items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#04584F' }}
    >
      <div className="text-center text-white z-10">
        <h2 className="text-2xl font-extrabold mb-10">Welcome to</h2>
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

      {/* Render and animate dots */}
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="dot absolute bg-white w-2 h-2 rounded-full animate-continuous-move"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`, // random delay for natural effect
            animationDuration: `${Math.random() * 30 + 20}s`, // slower continuous movement
          }}
        />
      ))}
    </div>
  );
}
