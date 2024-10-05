"use client";

import Link from 'next/link';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import workingPeopleImage from '@/assets/images/workingpeople.jpg'; // Existing image
import yogaImage from '@/assets/images/yoga.jpg'; // New image
import studyImage from '@/assets/images/study.jpg'; // New image
import runningImage from '@/assets/images/running.jpg'; // New image
import friendsImage from '@/assets/images/friends.jpg'; // New image

// Load Inter font
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  // Array of images to display in the carousel
  const images = [workingPeopleImage.src, yogaImage.src, studyImage, runningImage, friendsImage]; // Add more images as needed

  return (
    <div className={`flex flex-col min-h-screen items-center justify-center relative overflow-hidden bg-white ${inter.className}`}>
      {/* Hero Section */}
      <div className="text-center z-10 pt-24 px-6 md:px-0">
        <h2 className="text-xl md:text-2xl font-light text-gray-700 mb-6">
          Elevate your productivity, achieve more every day.
        </h2>
        <h1 className="text-5xl md:text-7xl font-bold text-black mb-8">
          ORO
        </h1>

        {/* Buttons Section */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-6 mb-12">
          <Link
            href="/auth/login"
            className="bg-black text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:bg-gray-900 transition duration-300 transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="border border-black text-black py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="relative w-full overflow-hidden mt-16">
        <div className="flex items-center space-x-6 animate-slide">
          {images.map((imageSrc, i) => (
            <Image
              key={i} // Unique key for each image
              src={imageSrc} // Dynamic image source from array
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
  );
}
