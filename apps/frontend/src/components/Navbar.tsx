'use client';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-soft-bg/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl shadow-soft">U</div>
        <h1 className="text-xl font-semibold tracking-tight text-soft-text">University Dashboard</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-sm text-gray-500 hidden sm:block font-medium">{time}</div>
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shadow-soft border-2 border-white">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Student" alt="Student Avatar" />
        </div>
      </div>
    </nav>
  );
}
