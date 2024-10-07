'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Course {
  id: number;
  name: string;
}

interface ActiveCourse extends Course {
  timeRemaining: number;
}

const navigation = [
  { name: 'Daily', href: '/private/dashboard', current: false },
  { name: 'Locked In', href: '/private/dashboard/locked_in', current: true },
];

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const CourseBox: React.FC<{ course: ActiveCourse; onTimeUp: () => void }> = ({ course, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(course.timeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-80 h-80 flex flex-col justify-center items-center">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">{course.name}</h3>
      <p className="text-6xl font-bold text-[#FDB515]">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </p>
    </div>
  );
};

const Popup: React.FC<{ courses: Course[]; onSelectCourse: (courseId: number) => void; onClose: () => void }> = ({ courses, onSelectCourse, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Choose your course</h2>
        <div className="space-y-2">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => onSelectCourse(course.id)}
              className="w-full bg-[#003262] text-white py-2 px-4 rounded-lg hover:bg-[#004A82] transition-colors duration-150 font-medium"
            >
              {course.name}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-150 font-medium">
          Close
        </button>
      </div>
    </div>
  );
};

export default function LockedIn() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<ActiveCourse | null>(null);
  const [newCourseName, setNewCourseName] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isLockedIn, setIsLockedIn] = useState(false);
  const [checkMarks, setCheckMarks] = useState<number>(0);
  const [showCheckBox, setShowCheckBox] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data || []);
      }
    } else {
      console.log('No authenticated user');
      router.push('/auth/login');
    }
  };

  const addCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourseName.trim()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('courses')
          .insert([
            { user_id: user.id, name: newCourseName.trim() }
          ])
          .select();
        
        if (error) {
          console.error('Error adding course:', error);
        } else if (data) {
          setCourses([...courses, data[0]]);
          setNewCourseName('');
        }
      }
    }
  };

  const deleteCourse = async (id: number) => {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting course:', error);
    } else {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const startLockedIn = () => {
    setIsLockedIn(true);
    setShowPopup(true);
  };

  const handleTimeUp = () => {
    setActiveCourse(null);
    setShowCheckBox(true);
  };

  const selectCourse = (courseId: number) => {
    const selectedCourse = courses.find(course => course.id === courseId);
    if (selectedCourse) {
      setActiveCourse({
        ...selectedCourse,
        timeRemaining: 30 * 60 // 30 minutes in seconds
      });
    }
    setShowPopup(false);
  };

  const handleCheckMark = () => {
    setCheckMarks(prevCheckMarks => prevCheckMarks + 1);
    setShowCheckBox(false);
    setShowPopup(true);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 bg-[#003262] text-white`}>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">ORO</h2>
          <nav>
            <ul>
              {navigation.map((item) => (
                <li key={item.name} className="mb-2">
                  <Link
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-[#004A82] text-white' : 'text-gray-300 hover:bg-[#004A82] hover:text-white',
                      'block px-3 py-2 rounded-md text-base font-medium'
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow">
          <div className="px-4 py-2 flex justify-between items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <div className="w-6 h-6 flex flex-col justify-around">
                <div className="w-full h-0.5 bg-gray-600"></div>
                <div className="w-full h-0.5 bg-gray-600"></div>
                <div className="w-full h-0.5 bg-gray-600"></div>
              </div>
            </button>
            <div className="flex items-center">
              <span className="mr-4 text-lg font-semibold text-[#FDB515]">Check Marks: {checkMarks}</span>
              <button
                onClick={handleLogout}
                className="bg-[#003262] text-white py-2 px-4 rounded-lg hover:bg-[#004A82] transition-all duration-200 text-sm"
              >
                Log out
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto">
            {!isLockedIn ? (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Courses</h2>
                <form onSubmit={addCourse} className="mb-6">
                  <input
                    type="text"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="Enter course name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003262]"
                  />
                  <button type="submit" className="mt-3 w-full bg-[#003262] text-white p-3 rounded-lg hover:bg-[#004A82] transition-colors duration-150 font-medium">
                    Add Course
                  </button>
                </form>

                <h3 className="text-xl font-semibold mb-2 text-gray-800">Added Courses:</h3>
                <ul className="mb-6">
                  {courses.map((course) => (
                    <li key={course.id} className="text-gray-700 flex justify-between items-center py-2 border-b">
                      <span>{course.name}</span>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={startLockedIn}
                  className="w-full bg-[#FDB515] text-[#003262] py-3 px-4 rounded-lg hover:bg-[#FDC545] transition-colors duration-150 font-medium"
                >
                  Lock In
                </button>
              </div>
            ) : (
              activeCourse && (
                <CourseBox course={activeCourse} onTimeUp={handleTimeUp} />
              )
            )}

            {showCheckBox && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6 text-center">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Great job! Did you complete your study session?</h3>
                <button
                  onClick={handleCheckMark}
                  className="bg-[#003262] text-white py-2 px-4 rounded-lg hover:bg-[#004A82] transition-colors duration-150 font-medium"
                >
                  Mark as Completed
                </button>
              </div>
            )}

            {showPopup && (
              <Popup
                courses={courses}
                onSelectCourse={selectCourse}
                onClose={() => setIsLockedIn(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}