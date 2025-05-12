'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';
import GoalCard from '@/components/GoalCard';
import XPBadge from '@/components/XPBadge';
import Link from 'next/link';
import { authClient } from "@/lib/auth-client";

// Goal interface matching your existing structure
interface Goal {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  timeEstimate: number;
  completed: boolean;
  createdAt: string;
  checkedInToday?: boolean;
}

// Stats interface for type safety
interface UserStats {
  totalXP: number;
  streak: number;
  todayXP: number;
  weeklyXP: number[];
}

// Map difficulty to XP values
const DIFFICULTY_XP = {
  easy: 10,
  medium: 25,
  hard: 50,
};

// Default weekly data (all zeros)
const DEFAULT_WEEKLY_XP = [0, 0, 0, 0, 0, 0, 0];

export default function DashboardPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Initialize all stats with zero values
  const [totalXP, setTotalXP] = useState(0);
  const [dayStreak, setDayStreak] = useState(0);
  const [dailyXP, setDailyXP] = useState(0);
  const [weeklyXP, setWeeklyXP] = useState(DEFAULT_WEEKLY_XP);

  useEffect(() => {
    fetchGoals();
  }, []);

  async function fetchGoals() {
    try {
      setLoading(true);
      // Check authentication
      const session = await authClient.getSession();
      if (!session) {
        return;
      }

      // Get the base URL dynamically
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      // Fetch goals with check-in status from your API
      const res = await fetch(`${baseUrl}/api/goals/dashboard`);
      const data = await res.json();
      
      if (res.ok) {
        // Set goals
        setGoals(data.goals || []);
        
        // Update stats if available from API
        if (data.stats) {
          setTotalXP(data.stats.totalXP || 0);
          setDayStreak(data.stats.streak || 0);
          setDailyXP(data.stats.todayXP || 0);
          
          // Set weekly XP data if available, otherwise use zeros
          if (data.stats.weeklyXP && Array.isArray(data.stats.weeklyXP)) {
            setWeeklyXP(data.stats.weeklyXP);
          }
        }
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
      // Get the base URL dynamically
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      // Call the API to record the check-in
      const res = await fetch(`${baseUrl}/api/goals/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Update the goal's check-in status in the UI
        const updatedGoals = goals.map(goal => {
          if (goal.id === goalId) {
            return { ...goal, checkedInToday: true };
          }
          return goal;
        });
        
        setGoals(updatedGoals);
        
        // Use XP earned from API response if available
        const xpEarned = data.checkIn?.xpEarned || 0;
        
        // Update stats
        setTotalXP(prev => prev + xpEarned);
        setDailyXP(prev => prev + xpEarned);
        
        // Update streak from API if available, otherwise increment
        if (data.newStreak) {
          setDayStreak(data.newStreak);
        } else {
          setDayStreak(prev => prev + 1);
        }
        
        // Update weekly XP if available
        if (data.updatedWeeklyXP && Array.isArray(data.updatedWeeklyXP)) {
          setWeeklyXP(data.updatedWeeklyXP);
        } else {
          // If not available, update the current day's XP
          const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
          const dayIndex = today === 0 ? 6 : today - 1; // Convert to 0 = Monday, 6 = Sunday
          
          setWeeklyXP(prev => {
            const updated = [...prev];
            updated[dayIndex] += xpEarned;
            return updated;
          });
        }
      } else {
        // Handle error - could be already checked in or other issue
        setError(data.error || 'Failed to check in');
        console.error('Check-in failed:', data.error);
      }
    } catch (err) {
      console.error('Error checking in goal:', err);
      setError('Failed to check in - please try again');
    }
  }

  // Filter active (incomplete) goals
  const activeGoals = goals.filter(goal => !goal.completed);

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-6 py-12 sm:px-10 sm:py-16 bg-white text-gray-900 dark:bg-black dark:text-white">
        <h1 className="text-3xl font-bold mb-10 text-center">Your Dashboard</h1>

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
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
              <div className="flex justify-between items-end mt-2 h-24">
                {weeklyXP.map((xp, i) => {
                  // Calculate height percentage based on XP value
                  // If all values are 0, show minimal height
                  const maxXP = Math.max(...weeklyXP);
                  const heightPercent = maxXP > 0 ? (xp / maxXP) * 100 : 0;
                  
                  return (
                    <div 
                      key={i} 
                      className="w-3 bg-blue-500 rounded" 
                      style={{ 
                        height: heightPercent > 0 ? `${heightPercent}%` : '5%'
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-left">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-start">
            <div className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow text-center">
              <p className="text-md font-medium text-gray-700 dark:text-gray-300">Day Streak</p>
              <p className="text-3xl font-bold text-orange-500 mt-2">🔥 {dayStreak}</p>
            </div>
            <div className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow text-center">
              <p className="text-md font-medium text-gray-700 dark:text-gray-300">Total XP</p>
              <p className="text-3xl font-bold text-yellow-500 mt-2">⚡ {totalXP}</p>
            </div>
            <div className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow text-center">
              <p className="text-md font-medium text-gray-700 dark:text-gray-300">Today's XP</p>
              <p className="text-3xl font-bold text-blue-500 mt-2">📅 {dailyXP}</p>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Daily Check-ins</h2>
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
          ) : activeGoals.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any active goals.</p>
              <Link 
                href="/goals" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Create Your First Goal
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  id={goal.id}
                  title={goal.title}
                  description={goal.description}
                  difficulty={goal.difficulty as "easy" | "medium" | "hard"}
                  timeEstimate={`${goal.timeEstimate} mins`}
                  checkedInToday={goal.checkedInToday || false}
                  onCheckIn={handleCheckIn}
                />
              ))}
            </div>
          )}
        </section>

        <section className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Team Progress</h2>
          <p className="text-gray-500 dark:text-gray-400 italic">
            Team goals and shared XP coming soon!
          </p>
        </section>
      </div>
    </ProtectedRoute>
  );
}