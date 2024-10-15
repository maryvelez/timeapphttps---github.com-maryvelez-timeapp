"use client";

import Link from 'next/link';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import workingPeopleImage from '@/assets/images/workingpeople.jpg';
import yogaImage from '@/assets/images/yoga.jpg';
import studyImage from '@/assets/images/study.jpg';
import runningImage from '@/assets/images/running.jpg';
import friendsImage from '@/assets/images/friends.jpg';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const images = [workingPeopleImage.src, yogaImage.src, studyImage, runningImage, friendsImage];

  return (
    <div className={`flex flex-col min-h-screen bg-white ${inter.className}`}>
      {/* Navigation */}
      <nav className="bg-white shadow-md fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-black">ORO</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/auth/login" className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link href="/auth/signup" className="ml-4 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition duration-300">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <div className="pt-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-light text-gray-700 mb-6">
              Elevate your productivity, achieve more every day.
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-8">
              ORO
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Your all-in-one solution for personal growth, productivity, and mental clarity.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/auth/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 md:py-4 md:text-lg md:px-10">
                  Get started
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link href="#features" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="relative w-full overflow-hidden mt-8">
          <div className="flex items-center space-x-6 animate-slide">
            {images.map((imageSrc, i) => (
              <Image
                key={i}
                src={imageSrc}
                alt={`Carousel Image ${i + 1}`}
                className="rounded-lg shadow-lg max-w-sm"
                width={300}
                height={200}
              />
            ))}
          </div>
        </div>

        {/* Add the custom CSS for animation */}
        <style jsx>{`
          .animate-slide {
            animation: slide 30s linear infinite;
          }

          @keyframes slide {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}</style>
      </div>

      {/* Key Features Section */}
      <div id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-black font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              ORO provides a comprehensive suite of tools to help you plan your future, stay productive, and maintain mental clarity.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  name: '5-Year Plan',
                  description: 'Set and visualize long-term goals with our intuitive 5-year planning tool.',
                },
                {
                  name: 'Daily Tasks',
                  description: 'Stay on top of your day-to-day responsibilities with our efficient task management system.',
                },
                {
                  name: 'Locked-In Focus',
                  description: 'Boost productivity with our distraction-free mode for deep work sessions.',
                },
                {
                  name: 'Mind AI',
                  description: 'Clear your mind of distractions with our AI-powered tool for mental decluttering and organization.',
                },
              ].map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-black text-white">
                      {/* You can add icons here if desired */}
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 overflow-hidden">
        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="relative lg:grid lg:grid-cols-3 lg:gap-x-8">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                How ORO works
              </h2>
            </div>
            <dl className="mt-10 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:mt-0 lg:col-span-2">
              {[
                {
                  name: 'Plan Your Future',
                  description: 'Use our 5-Year Plan to set long-term goals and break them down into actionable steps.',
                },
                {
                  name: 'Manage Your Day',
                  description: 'Organize and prioritize your daily tasks to stay productive and focused.',
                },
                {
                  name: 'Enhance Your Focus',
                  description: 'Utilize the Locked-In feature to create distraction-free work environments.',
                },
                {
                  name: 'Clear Your Mind',
                  description: 'Let our Mind AI help you organize thoughts and reduce mental clutter.',
                },
              ].map((item) => (
                <div key={item.name} className="relative">
                  <dt>
                    <p className="text-lg leading-6 font-medium text-gray-900">{item.name}</p>
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto md:grid md:grid-cols-2 md:px-6 lg:px-8">
          <div className="py-12 px-4 sm:px-6 md:flex md:flex-col md:py-16 md:pl-0 md:pr-10 md:border-r md:border-gray-200 lg:pr-16">
            <blockquote className="mt-8 md:flex-grow md:flex md:flex-col">
              <div className="relative text-lg font-medium text-gray-700 md:flex-grow">
                <p className="relative">
                  ORO's 5-Year Plan feature has given me a clear roadmap for my future. The daily task management keeps me on track, and the Mind AI helps me stay focused and calm.
                </p>
              </div>
              <footer className="mt-4">
                <p className="text-base font-semibold text-black">Sarah Johnson</p>
                <p className="text-base text-gray-500">Junior, Computer Science Major</p>
              </footer>
            </blockquote>
          </div>
          <div className="py-12 px-4 sm:px-6 md:py-16 md:pr-0 md:pl-10 lg:pl-16">
            <blockquote className="mt-8 md:flex-grow md:flex md:flex-col">
              <div className="relative text-lg font-medium text-gray-700 md:flex-grow">
                <p className="relative">
                  The Locked-In focus feature has dramatically improved my productivity. ORO has become an essential tool in my transition from college to my professional career.
                </p>
              </div>
              <footer className="mt-4">
                <p className="text-base font-semibold text-black">Alex Chen</p>
                <p className="text-base text-gray-500">Marketing Associate</p>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to take control of your future?</span>
            <span className="block">Start your journey with ORO today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-200">
            Join thousands of students and young professionals who are achieving their goals with ORO.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            {/* Add social media links here if desired */}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 ORO, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}