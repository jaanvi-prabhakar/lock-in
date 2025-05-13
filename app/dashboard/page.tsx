'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';
import GoalCard from '@/components/GoalCard';
import XPBadge from '@/components/XPBadge';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Award, BarChart2, Trophy, Users, Calendar, Target, Smile } from 'lucide-react';
import Footer from '@/components/Footer';

// Goal interface matching your existing structure
interface Goal {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
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
  level: number;
  badges: string[];
}

// Badge definitions
const BADGES = {
  STREAK_7: {
    name: 'Week Warrior',
    icon: '🔥',
    description: '7-day streak achieved!'
  },
  STREAK_30: {
    name: 'Monthly Master',
    icon: '🏆',
    description: '30-day streak achieved!'
  },
  XP_500: {
    name: 'XP Collector',
    icon: '⚡',
    description: 'Earned 500 XP total'
  },
  GOALS_10: {
    name: 'Goal Getter',
    icon: '🎯',
    description: 'Completed 10 goals'
  },
  EARLY_ADOPTER: {
    name: 'Early Adopter',
    icon: '🚀',
    description: 'Among the first to join Lock-in'
  }
};

// Map difficulty to XP values
const DIFFICULTY_XP = {
  easy: 10,
  medium: 25,
  hard: 50,
};

// Default weekly data (all zeros)
const DEFAULT_WEEKLY_XP = [0, 0, 0, 0, 0, 0, 0];

// Calculate level based on total XP
const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

// Calculate progress to next level (percentage)
const calculateLevelProgress = (xp: number): number => {
  const currentLevel = calculateLevel(xp);
  const baseXP = (currentLevel - 1) * 100;
  const nextLevelXP = currentLevel * 100;
  return ((xp - baseXP) / (nextLevelXP - baseXP)) * 100;
};

export default function DashboardPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isShowingBadges, setIsShowingBadges] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [xpAnimationPlayed, setXpAnimationPlayed] = useState(false);
  const [xpCelebration, setXpCelebration] = useState(false);
  
  // Refs for draggable goals
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Initialize all stats with zero values
  const [totalXP, setTotalXP] = useState(0);
  const [dayStreak, setDayStreak] = useState(0);
  const [dailyXP, setDailyXP] = useState(0);
  const [weeklyXP, setWeeklyXP] = useState(DEFAULT_WEEKLY_XP);
  const [badges, setBadges] = useState<string[]>([]);
  
  // Get current level based on XP
  const userLevel = calculateLevel(totalXP);
  const levelProgress = calculateLevelProgress(totalXP);
  
  useEffect(() => {
    fetchGoals();
  }, []);
  
  // Animation effect for XP when it loads
  useEffect(() => {
    if (totalXP > 0 && !xpAnimationPlayed) {
      setXpAnimationPlayed(true);
    }
  }, [totalXP, xpAnimationPlayed]);

  async function fetchGoals() {
    try {
      setLoading(true);
      // Check authentication - commenting this out for now
      // const session = await authClient.getSession();
      // if (!session) {
      //   return;
      // }

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
          
          // Set badges if available
          if (data.stats.badges && Array.isArray(data.stats.badges)) {
            setBadges(data.stats.badges);
          } else {
            // Mock badges for UI demo purposes
            if (data.stats.totalXP > 500) setBadges(prev => [...prev, 'XP_500']);
            if (data.stats.streak >= 7) setBadges(prev => [...prev, 'STREAK_7']);
            if (data.stats.streak >= 30) setBadges(prev => [...prev, 'STREAK_30']);
            setBadges(prev => [...prev, 'EARLY_ADOPTER']);
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
        body: JSON.stringify({ goalId }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update the goal's check-in status in the UI
        const updatedGoals = goals.map((goal) => {
          if (goal.id === goalId) {
            return { ...goal, checkedInToday: true };
          }
          return goal;
        });

        setGoals(updatedGoals);

        // Use XP earned from API response if available
        const xpEarned = data.checkIn?.xpEarned || DIFFICULTY_XP[updatedGoals.find(g => g.id === goalId)?.difficulty || 'easy'];

        // Show XP celebration animation
        setXpCelebration(true);
        setTimeout(() => setXpCelebration(false), 2000);

        // Update stats
        setTotalXP((prev) => prev + xpEarned);
        setDailyXP((prev) => prev + xpEarned);

        // Update streak from API if available, otherwise increment
        if (data.newStreak) {
          setDayStreak(data.newStreak);
        } else {
          setDayStreak((prev) => prev + 1);
        }

        // Update weekly XP if available
        if (data.updatedWeeklyXP && Array.isArray(data.updatedWeeklyXP)) {
          setWeeklyXP(data.updatedWeeklyXP);
        } else {
          // If not available, update the current day's XP
          const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
          const dayIndex = today === 0 ? 6 : today - 1; // Convert to 0 = Monday, 6 = Sunday

          setWeeklyXP((prev) => {
            const updated = [...prev];
            updated[dayIndex] += xpEarned;
            return updated;
          });
        }
        
        // Check for new badges based on updated stats
        const newTotalXP = totalXP + xpEarned;
        const newStreak = data.newStreak || (dayStreak + 1);
        
        // Add badges based on milestones
        if (newTotalXP >= 500 && !badges.includes('XP_500')) {
          setBadges(prev => [...prev, 'XP_500']);
        }
        
        if (newStreak >= 7 && !badges.includes('STREAK_7')) {
          setBadges(prev => [...prev, 'STREAK_7']);
        }
        
        if (newStreak >= 30 && !badges.includes('STREAK_30')) {
          setBadges(prev => [...prev, 'STREAK_30']);
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
  
  // Drag and drop functionality for goals reordering
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };
  
  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };
  
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const activeGoals = goals.filter((goal) => !goal.completed);
      const draggedItemContent = activeGoals[dragItem.current];
      
      // Remove and insert at new position
      const newActiveGoals = [...activeGoals];
      newActiveGoals.splice(dragItem.current, 1);
      newActiveGoals.splice(dragOverItem.current, 0, draggedItemContent);
      
      // Combine with completed goals
      const completedGoals = goals.filter((goal) => goal.completed);
      setGoals([...newActiveGoals, ...completedGoals]);
      
      // Reset refs
      dragItem.current = null;
      dragOverItem.current = null;
    }
  };

  // Filter active (incomplete) goals
  const activeGoals = goals.filter((goal) => !goal.completed);
  
  // Function to toggle badges panel
  const toggleBadgesPanel = () => {
    setIsShowingBadges(!isShowingBadges);
  };
  
  // Handle badge click
  const handleBadgeClick = (badgeId: string) => {
    setSelectedBadge(selectedBadge === badgeId ? null : badgeId);
  };
  
  // Determine the current day for highlighting in the weekly chart
  const getCurrentDayIndex = () => {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    return today === 0 ? 6 : today - 1; // Convert to 0 = Monday, 6 = Sunday
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-200">
        <motion.div 
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
            variants={itemVariants}
          >
            Your Productivity Dashboard
          </motion.h1>
          
          {error && (
            <motion.div 
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-6 max-w-3xl mx-auto shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
          
          {/* XP Celebration Animation */}
          <AnimatePresence>
            {xpCelebration && (
              <motion.div 
                className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="text-6xl font-bold text-yellow-500 bg-white/20 dark:bg-black/20 backdrop-blur-sm p-8 rounded-2xl shadow-lg"
                  initial={{ scale: 0.5, y: 50 }}
                  animate={{ scale: 1.2, y: 0 }}
                  exit={{ scale: 0.5, y: -50 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15 
                  }}
                >
                  +{DIFFICULTY_XP[activeGoals.find(g => !g.checkedInToday)?.difficulty || 'easy']} XP!
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.section className="mb-8" variants={itemVariants}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Level & XP Progress */}
              <motion.div 
                className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md relative overflow-hidden"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700"></div>
                <motion.div 
                  className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                ></motion.div>
                
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  Level {userLevel}
                </h3>
                
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Progress to Level {userLevel + 1}</p>
                    <motion.div 
                      className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-1 overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8 }}
                    >
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${levelProgress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      ></motion.div>
                    </motion.div>
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-yellow-500"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {totalXP}
                    <span className="ml-1 text-sm text-yellow-400">XP</span>
                  </motion.div>
                </div>
                
                {badges.length > 0 && (
                  <div className="mt-4">
                    <motion.button
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none flex items-center"
                      onClick={toggleBadgesPanel}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Award className="w-4 h-4 mr-1" />
                      {isShowingBadges ? 'Hide Badges' : `View ${badges.length} Badge${badges.length > 1 ? 's' : ''}`}
                    </motion.button>
                  </div>
                )}
              </motion.div>
              
              {/* Stats Overview */}
              <motion.div 
                className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4"
                variants={itemVariants}
              >
                <motion.div 
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center justify-center"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="text-orange-500 text-xl mb-1"
                    animate={pulseAnimation}
                  >
                    🔥
                  </motion.div>
                  <p className="text-xl font-bold">{dayStreak}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center justify-center"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="text-blue-500 text-xl mb-1"
                    animate={pulseAnimation}
                  >
                    📅
                  </motion.div>
                  <motion.p 
                    className="text-xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {dailyXP}
                  </motion.p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Today's XP</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center justify-center"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Target className="w-5 h-5 text-green-500 mb-1" />
                  <p className="text-xl font-bold">{activeGoals.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active Goals</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center justify-center"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Users className="w-5 h-5 text-purple-500 mb-1" />
                  <p className="text-xl font-bold">5</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Team Rank</p>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Badges Panel */}
            <AnimatePresence>
              {isShowingBadges && (
                <motion.div 
                  className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-500" />
                    Your Badges
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {badges.map((badgeId) => (
                      <motion.div
                        key={badgeId}
                        className={`p-3 rounded-lg cursor-pointer text-center transition ${
                          selectedBadge === badgeId 
                            ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500' 
                            : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handleBadgeClick(badgeId)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-2xl mb-1">{BADGES[badgeId as keyof typeof BADGES]?.icon || '🏅'}</div>
                        <div className="text-sm font-medium">{BADGES[badgeId as keyof typeof BADGES]?.name || badgeId}</div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {selectedBadge && (
                    <motion.div 
                      className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4 className="font-medium flex items-center">
                        {BADGES[selectedBadge as keyof typeof BADGES]?.icon || '🏅'}{' '}
                        {BADGES[selectedBadge as keyof typeof BADGES]?.name || selectedBadge}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {BADGES[selectedBadge as keyof typeof BADGES]?.description || 'A special achievement you unlocked!'}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
          
          <motion.section className="mb-8" variants={itemVariants}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Weekly Progress</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last 7 days
              </div>
            </div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
              
              <div className="flex justify-between items-end mt-2 h-36">
                {weeklyXP.map((xp, i) => {
                  // Calculate height percentage based on XP value
                  const maxXP = Math.max(...weeklyXP, 1); // Ensure we don't divide by zero
                  const heightPercent = (xp / maxXP) * 100;
                  const isCurrentDay = i === getCurrentDayIndex();
                  
                  return (
                    <motion.div
                      key={i}
                      className={`w-10 rounded-t-lg flex items-end justify-center ${
                        isCurrentDay ? 'bg-blue-500 relative' : 'bg-blue-400/70 dark:bg-blue-500/50'
                      }`}
                      initial={{ height: '0%' }}
                      animate={{ height: `${heightPercent > 0 ? heightPercent : 5}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      whileHover={{
                        y: -5,
                        backgroundColor: isCurrentDay ? 'rgb(59, 130, 246)' : 'rgb(96, 165, 250)',
                      }}
                    >
                      {xp > 0 && (
                        <motion.span 
                          className="absolute -top-6 text-xs font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          {xp}
                        </motion.span>
                      )}
                      
                      {isCurrentDay && (
                        <motion.div 
                          className="absolute -bottom-2 w-full h-1 bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.3, delay: 0.8 }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="flex justify-between items-center mt-8 text-sm">
                <div className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Total Weekly XP:</span> {weeklyXP.reduce((sum, xp) => sum + xp, 0)}
                </div>
                
                <motion.button
                  className="text-blue-600 dark:text-blue-400 flex items-center text-sm focus:outline-none"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Full Stats <ArrowUpRight className="w-4 h-4 ml-1" />
                </motion.button>
              </div>
            </motion.div>
          </motion.section>
          
          <motion.section className="mb-8" variants={itemVariants}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Daily Check-ins</h2>
              <Link
                href="/goals"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow flex items-center text-sm"
              >
                <Target className="w-4 h-4 mr-1" /> Manage Goals
              </Link>
            </div>
            
            {loading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading your goals...</p>
              </div>
            ) : activeGoals.length === 0 ? (
              <motion.div 
                className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mx-auto mb-4 opacity-60 w-24 h-24 flex items-center justify-center">
                  <Target className="w-16 h-16 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You don't have any active goals.
                </p>
                <Link
                  href="/goals"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow inline-flex items-center"
                >
                  <Target className="w-5 h-5 mr-2" /> Create Your First Goal
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGoals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-grab active:cursor-grabbing"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className={`h-1.5 w-full ${
                      goal.difficulty === 'easy' ? 'bg-green-500' :
                      goal.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-1">{goal.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{goal.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-medium text-gray-600 dark:text-gray-300">
                            {goal.timeEstimate} mins
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            goal.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                            goal.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                            'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          }`}>
                            {goal.difficulty.charAt(0).toUpperCase() + goal.difficulty.slice(1)}
                          </span>
                        </div>
                        
                        {goal.checkedInToday ? (
                          <motion.div 
                            className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          >
                            <motion.svg 
                              className="w-5 h-5 mr-1" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </motion.svg>
                            Completed
                          </motion.div>
                        ) : (
                          <motion.button 
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow-sm hover:shadow transition-colors"
                            onClick={() => handleCheckIn(goal.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Check In
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
          
          <motion.section className="mb-8" variants={itemVariants}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Team Progress</h2>
                <motion.button
                  className="text-blue-600 dark:text-blue-400 flex items-center text-sm focus:outline-none"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join a Team <ArrowUpRight className="w-4 h-4 ml-1" />
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                  className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-lg text-white col-span-2 flex flex-col justify-between"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">CS Study Squad</h3>
                      <span className="bg-white/20 px-2 py-1 rounded text-xs">5 members</span>
                    </div>
                    <p className="text-white/80 mt-1 text-sm">Complete team challenges to earn bonus XP!</p>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Weekly Goal: 2000 XP</span>
                      <span>875 / 2000</span>
                    </div>
                    <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '43.75%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                      ></motion.div>
                    </div>
                    
                    <motion.button
                      className="mt-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm flex items-center"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Team Dashboard
                    </motion.button>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 flex flex-col justify-between"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold mb-2">Create Team</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Invite friends and work on goals together.</p>
                  
                  <motion.button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create New Team
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.section>
          
          <motion.section variants={itemVariants}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Upcoming Challenges</h2>
              
              <div className="relative mt-4 overflow-hidden rounded-lg">
                <div className="relative overflow-x-auto pb-4 hide-scrollbar">
                  <div className="flex space-x-4">
                    <motion.div 
                      className="w-72 flex-shrink-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg p-4 text-white"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">7-Day Coding Streak</h3>
                        <span className="bg-white/20 px-2 py-1 rounded text-xs">May 15-21</span>
                      </div>
                      <p className="mt-2 text-sm text-white/80">Complete a coding goal every day for 7 days straight.</p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">+300 XP Bonus</span>
                        <motion.button
                          className="bg-white text-orange-600 px-3 py-1 rounded-lg text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Join
                        </motion.button>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="w-72 flex-shrink-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg p-4 text-white"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">Resume Workshop</h3>
                        <span className="bg-white/20 px-2 py-1 rounded text-xs">May 18</span>
                      </div>
                      <p className="mt-2 text-sm text-white/80">Update your resume and get feedback from industry experts.</p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">+100 XP Bonus</span>
                        <motion.button
                          className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Join
                        </motion.button>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="w-72 flex-shrink-0 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg p-4 text-white"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">May Hackathon</h3>
                        <span className="bg-white/20 px-2 py-1 rounded text-xs">May 25-26</span>
                      </div>
                      <p className="mt-2 text-sm text-white/80">Join a team and build a project in 48 hours.</p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">+500 XP Bonus</span>
                        <motion.button
                          className="bg-white text-purple-600 px-3 py-1 rounded-lg text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Join
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                <div className="absolute top-0 right-0 bottom-0 w-24 pointer-events-none bg-gradient-to-l from-white dark:from-gray-800"></div>
              </div>
            </div>
          </motion.section>
          
          {/* Inspirational Quote */}
          <motion.div 
            className="mt-8 text-center p-6"
            variants={itemVariants}
          >
            <p className="text-gray-600 dark:text-gray-400 italic">
              "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
              — Aristotle
            </p>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </ProtectedRoute>
  );
}