'use client';

import Image from 'next/image';
import GoalCard from '@/components/GoalCard';
import XPBadge from '@/components/XPBadge';

export default function Dashboard() {
  return (
    <div className="min-h-screen px-10 py-16 sm:px-20 sm:py-24 bg-white text-gray-900 dark:bg-black dark:text-white">
      <h1 className="text-3xl font-bold mb-10 text-center">Lock-in</h1>

      <section className="mb-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-left">Weekly XP Progress</h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            <div className="flex justify-between items-end mt-2 h-24">
              {[40, 60, 80, 30, 90, 70, 50].map((height, i) => (
                <div key={i} className="w-3 bg-blue-500 rounded" style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-left">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-start">
          <div className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow text-center">
            <p className="text-md font-medium text-gray-700 dark:text-gray-300">Day Streak</p>
            <p className="text-3xl font-bold text-orange-500 mt-2">🔥 7</p>
          </div>
          <div className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow text-center">
            <p className="text-md font-medium text-gray-700 dark:text-gray-300">Total XP</p>
            <p className="text-3xl font-bold text-yellow-500 mt-2">⚡ 1220</p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Team Progress</h2>
        <p className="text-gray-500 dark:text-gray-400 italic">
          Team goals and shared XP coming soon!
        </p>
      </section>
    </div>
  );
}
