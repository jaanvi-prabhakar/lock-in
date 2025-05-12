'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

interface Goal {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  timeEstimate: number;
  completed: boolean;
  createdAt: string;
}

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [timeEstimate, setTimeEstimate] = useState('30');

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const session = await authClient.getSession();
      if (!session) {
        router.push('/auth/sign-in');
        return;
      }
      setIsAuthenticated(true);
      fetchGoals();
    } catch (err) {
      console.error('Auth error:', err);
      router.push('/auth/sign-in');
    }
  }

  async function fetchGoals() {
    try {
      const res = await fetch('/api/goals/my');
      const data = await res.json();

      if (res.ok) {
        setGoals(data.goals || []);
      } else {
        setError(data.error || 'Failed to fetch goals');
      }
    } catch (err) {
      setError('Failed to fetch goals');
      console.error(err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/goals/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          difficulty,
          timeEstimate: parseInt(timeEstimate),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setGoals((prev) => [...prev, data.goal]);
        // Reset form
        setTitle('');
        setDescription('');
        setDifficulty('medium');
        setTimeEstimate('30');
      } else {
        setError(data.error || 'Failed to create goal');
      }
    } catch (err) {
      setError('Failed to create goal');
      console.error(err);
    } finally {
      setLoading(false);
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
        setGoals((prev) =>
          prev.map((goal) => (goal.id === goalId ? { ...goal, completed: !goal.completed } : goal))
        );
      } else {
        setError('Failed to update goal');
      }
    } catch (err) {
      console.error('Error updating goal:', err);
      setError('Failed to update goal');
    }
  }

  if (!isAuthenticated) {
    return <div className="p-8">Checking authentication...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Goals</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8 space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Learn TypeScript"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Master TypeScript fundamentals and advanced concepts..."
            className="w-full px-3 py-2 border rounded-md h-24"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label htmlFor="timeEstimate" className="block text-sm font-medium mb-1">
              Time Estimate (minutes)
            </label>
            <input
              id="timeEstimate"
              type="number"
              value={timeEstimate}
              onChange={(e) => setTimeEstimate(e.target.value)}
              min="1"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Add Goal'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border ${
              goal.completed
                ? 'border-green-500 dark:border-green-700'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3
                className={`text-xl font-semibold ${goal.completed ? 'line-through text-gray-500' : ''}`}
              >
                {goal.title}
              </h3>
              <button
                onClick={() => toggleGoalCompletion(goal.id, goal.completed)}
                className={`px-2 py-1 rounded text-sm ${
                  goal.completed
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {goal.completed ? '✓ Done' : 'Mark Done'}
              </button>
            </div>
            {goal.description && (
              <p
                className={`text-gray-600 dark:text-gray-400 mb-4 text-sm ${goal.completed ? 'line-through' : ''}`}
              >
                {goal.description}
              </p>
            )}
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Difficulty: {goal.difficulty}</span>
              <span>{goal.timeEstimate} mins</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
