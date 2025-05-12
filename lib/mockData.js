// /lib/mockData.js or /lib/mockGoals.js

import { v4 as uuidv4 } from 'uuid'; // You'll need to install this

// Mock initial goals data
export const mockInitialGoals = [
  {
    id: '1',
    title: 'Learn TypeScript Basics',
    description: 'Master the fundamentals of TypeScript including types, interfaces, and generics',
    difficulty: 'medium',
    timeEstimate: 60,
    completed: false,
    createdAt: new Date().toISOString(),
    checkedInToday: false,
  },
  {
    id: '2',
    title: 'Build a Next.js Portfolio',
    description: 'Create a personal portfolio using Next.js and Tailwind CSS',
    difficulty: 'hard',
    timeEstimate: 120,
    completed: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    checkedInToday: false,
  },
  {
    id: '3',
    title: 'Learn React Hooks',
    description: 'Master useState, useEffect, useContext and other critical React hooks',
    difficulty: 'easy',
    timeEstimate: 45,
    completed: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    checkedInToday: false,
  },
];

// Function to get goals from localStorage or use initial mock data
export function getStoredGoals() {
  if (typeof window === 'undefined') return mockInitialGoals;
  
  const storedGoals = localStorage.getItem('mockGoals');
  return storedGoals ? JSON.parse(storedGoals) : mockInitialGoals;
}

// Function to save goals to localStorage
export function saveGoals(goals) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockGoals', JSON.stringify(goals));
  }
}

// Add a new goal
export function addGoal(goalData) {
  const newGoal = {
    id: uuidv4(),
    title: goalData.title,
    description: goalData.description,
    difficulty: goalData.difficulty,
    timeEstimate: goalData.timeEstimate,
    completed: false,
    createdAt: new Date().toISOString(),
    checkedInToday: false,
  };
  
  const currentGoals = getStoredGoals();
  const updatedGoals = [...currentGoals, newGoal];
  saveGoals(updatedGoals);
  
  return newGoal;
}

// Toggle goal completion
export function toggleGoalCompletion(goalId) {
  const currentGoals = getStoredGoals();
  const updatedGoals = currentGoals.map(goal => 
    goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
  );
  saveGoals(updatedGoals);
  
  return updatedGoals;
}

// Check in to a goal
export function checkInGoal(goalId) {
  const currentGoals = getStoredGoals();
  const updatedGoals = currentGoals.map(goal => 
    goal.id === goalId ? { ...goal, checkedInToday: true } : goal
  );
  saveGoals(updatedGoals);
  
  // Calculate XP based on difficulty
  const goal = currentGoals.find(g => g.id === goalId);
  const xpEarned = goal ? 
    (goal.difficulty === 'easy' ? 10 : goal.difficulty === 'medium' ? 25 : 50) : 0;
  
  return { 
    updatedGoals,
    xpEarned
  };
}

// Generate mock stats
export function getMockStats() {
  const goals = getStoredGoals();
  
  // Count checked in goals today for XP
  const todayXP = goals
    .filter(g => g.checkedInToday)
    .reduce((sum, g) => {
      const xp = g.difficulty === 'easy' ? 10 : g.difficulty === 'medium' ? 25 : 50;
      return sum + xp;
    }, 0);
  
  // Generate mock weekly XP
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1; // Convert to 0 = Monday, 6 = Sunday
  
  const weeklyXP = [0, 0, 0, 0, 0, 0, 0];
  weeklyXP[dayIndex] = todayXP;
  
  // Add some random data for previous days
  for (let i = 0; i < dayIndex; i++) {
    weeklyXP[i] = Math.floor(Math.random() * 100);
  }
  
  return {
    totalXP: 500 + todayXP, // Base 500 + today's XP
    streak: 4, // Mock streak
    todayXP,
    weeklyXP
  };
}