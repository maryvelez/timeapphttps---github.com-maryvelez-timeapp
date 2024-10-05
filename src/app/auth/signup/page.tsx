
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link'; // Import Link component

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error('Error signing up:', error.message);
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link href="/">
          <h1 className="text-4xl font-bold text-center text-black cursor-pointer">
            ORO
          </h1>
        </Link>
        <h2 className="mt-8 text-center text-3xl font-bold text-gray-900">
          Create Your Oro Account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="block w-full rounded-md border border-gray-400 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="block w-full rounded-md border border-gray-400 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-gray-900 bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already a member?{' '}
          <a href="/auth/login" className="font-semibold text-gray-900 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}