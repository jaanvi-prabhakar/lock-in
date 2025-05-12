'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import ProtectedRoute from '@/components/ProtectedRoute';
import GoalCard from '@/components/GoalCard';

// Goal type definition matching your existing structure
interface Goal {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: number;
  completed: boolean;
  checkedInToday: boolean;
  createdAt: string;
}

// Difficulty to XP mapping
const difficultyXP = {
  easy: 10,
  medium: 25,
  hard: 50,
};

export default function DashboardPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalXP, setTotalXP] = useState(1220); // Initial XP value
  const [dayStreak, setDayStreak] = useState(7); // Initial streak value

  // Week day XP data - would come from API in real app
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyXP = [40, 60, 80, 30, 90, 70, 50];

  useEffect(() => {
    fetchGoals();
  }, []);

  async function fetchGoals() {
    try {
      setLoading(true);
      const session = await authClient.getSession();
      if (!session) {
        return;
      }

      const res = await fetch('/api/goals/my');
      const data = await res.json();

      if (res.ok) {
        // Add checkedInToday property as false initially
        // In a real app, you'd get this from your API
        const goalsWithCheckIn = (data.goals || []).map((goal: Goal) => ({
          ...goal,
          checkedInToday: false,
        }));

        setGoals(goalsWithCheckIn);

        // Filter goals
        setActiveGoals(goalsWithCheckIn.filter((goal: Goal) => !goal.completed));
        setCompletedGoals(goalsWithCheckIn.filter((goal: Goal) => goal.completed));

        // Calculate XP from completed goals (just an example)
        const earnedXP = goalsWithCheckIn
          .filter((goal: Goal) => goal.completed)
          .reduce((total: number, goal: Goal) => {
            return total + (difficultyXP[goal.difficulty] || 0);
          }, 0);

        setTotalXP(1220 + earnedXP);
      } else {
        setError(data.error || 'Failed to fetch goals');
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckIn(goalId: string) {
    try {
      // Here you would call your API to record the check-in
      // For now, we'll update the state directly
      setGoals((prev) =>
        prev.map((goal) => (goal.id === goalId ? { ...goal, checkedInToday: true } : goal))
      );

      // Update active goals as well
      setActiveGoals((prev) =>
        prev.map((goal) => (goal.id === goalId ? { ...goal, checkedInToday: true } : goal))
      );

      // Add XP for check-in
      const goal = goals.find((g) => g.id === goalId);
      if (goal) {
        const xpGained = difficultyXP[goal.difficulty] || 10;
        setTotalXP((prev) => prev + xpGained);
      }

      // Update streak
      setDayStreak((prev) => prev + 1);
    } catch (err) {
      console.error('Error checking in:', err);
    }
  }

  async function toggleGoalCompletion(goalId: string, currentStatus: boolean) {
    try {
      const res = await fetch('/api/goals/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId, completed: !currentStatus }),
      });

      if (res.ok) {
        // Update goals
        const updatedGoals = goals.map((goal) =>
          goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
        );

        setGoals(updatedGoals);

        // Re-filter goals
        setActiveGoals(updatedGoals.filter((goal) => !goal.completed));
        setCompletedGoals(updatedGoals.filter((goal) => goal.completed));
      }
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-6 py-12 sm:px-10 sm:py-16 bg-white text-gray-900 dark:bg-black dark:text-white">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8 text-center">Your Dashboard</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded mb-4 max-w-3xl mx-auto">
              {error}
            </div>
          )}

          <section className="mb-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-left">Weekly XP Progress</h2>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {weekDays.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="flex justify-between items-end mt-2 h-24">
                  {weeklyXP.map((height, i) => (
                    <motion.div
                      key={i}
                      className="w-6 bg-blue-500 rounded"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    ></motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <motion.section
            className="max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-left">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-start">
              <motion.div
                className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow text-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <p className="text-md font-medium text-gray-700 dark:text-gray-300">Day Streak</p>
                <p className="text-3xl font-bold text-orange-500 mt-2">🔥 {dayStreak}</p>
              </motion.div>
              <motion.div
                className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow text-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <p className="text-md font-medium text-gray-700 dark:text-gray-300">Total XP</p>
                <p className="text-3xl font-bold text-yellow-500 mt-2">⚡ {totalXP}</p>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            className="max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">My Goals</h2>
              <Link
                href="/goals"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Manage Goals
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your goals...</p>
              </div>
            ) : activeGoals.length === 0 && completedGoals.length === 0 ? (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You haven't created any goals yet.
                </p>
                <Link
                  href="/goals"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Create Your First Goal
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {activeGoals.length > 0 && (
                  <div>
                    <h3 className="text-xl font-medium mb-3">In Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeGoals.slice(0, 4).map((goal) => (
                        <GoalCard
                          key={goal.id}
                          id={goal.id}
                          title={goal.title}
                          description={goal.description}
                          difficulty={goal.difficulty}
                          timeEstimate={`${goal.timeEstimate} mins`}
                          checkedInToday={goal.checkedInToday}
                          onCheckIn={handleCheckIn}
                        />
                      ))}
                      {activeGoals.length > 4 && (
                        <Link
                          href="/goals"
                          className="text-blue-600 dark:text-blue-400 text-center block col-span-2 mt-2"
                        >
                          View {activeGoals.length - 4} more goals
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {completedGoals.length > 0 && (
                  <div>
                    <h3 className="text-xl font-medium mb-3">Recently Completed</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {completedGoals.slice(0, 2).map((goal) => (
                        <GoalCard
                          key={goal.id}
                          id={goal.id}
                          title={goal.title}
                          description={goal.description}
                          difficulty={goal.difficulty}
                          timeEstimate={`${goal.timeEstimate} mins`}
                          checkedInToday={true}
                          onCheckIn={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.section>

          <motion.section
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Team Progress</h2>
            <p className="text-gray-500 dark:text-gray-400 italic">
              Team goals and shared XP coming soon!
            </p>
          </motion.section>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
