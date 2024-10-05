"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link component

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error logging in:', error.message);
      setErrorMessage('Login failed. Please check your credentials.');
    } else {
      router.push('/private/dashboard');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link href="/">
          <h1 className="text-4xl font-bold text-center text-black cursor-pointer">
            ORO
          </h1>
        </Link>
        <h2 className="mt-8 text-center text-3xl font-bold text-gray-900">
          Time to sign in. 
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-black focus:outline-none sm:text-sm"
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-black focus:outline-none sm:text-sm"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">
              {errorMessage}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Log in
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          New to Oro?{' '}
          <a href="/auth/signup" className="font-semibold text-black hover:text-gray-800">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}