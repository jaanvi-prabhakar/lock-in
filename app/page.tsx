'use client';

import Image from 'next/image';
import GoalCard from '@/components/GoalCard';
import XPBadge from '@/components/XPBadge';

export default function Dashboard() {
  return (
    <div className="min-h-screen px-4 py-10 bg-white text-gray-900 dark:bg-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back!</h1>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
        <XPBadge level={5} xp={1220} nextLevelXP={1500} />
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center sm:text-right">
          <p className="text-sm text-gray-600 dark:text-gray-300">Daily Streak</p>
          <p className="text-2xl font-semibold text-orange-500">🔥 7 days</p>
        </div>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Today's Goals</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            + Add Goal
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <GoalCard
            title="Do 1 LeetCode problem"
            description="Stay sharp with one problem a day"
            difficulty="medium"
            timeEstimate="20 min"
            checkedInToday={false}
          />
          <GoalCard
            title="Finish AWS Cert Module"
            description="Complete today's learning module"
            difficulty="hard"
            timeEstimate="1 hr"
            checkedInToday={true}
          />
          <GoalCard
            title="Read 1 ML paper"
            description="Keep up with research!"
            difficulty="medium"
            timeEstimate="45 min"
            checkedInToday={false}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Team Progress</h2>
        <div className="text-gray-500 dark:text-gray-400 italic">
          {/* You could render TeamCard components here once they're implemented */}
          Team goals and shared XP coming soon!
        </div>
      </section>
    </div>
  );
}
