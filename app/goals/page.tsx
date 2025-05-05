"use client";

import { useEffect, useState } from "react";
import GoalCard from "@/components/GoalCard";
import Link from "next/link";

interface Goal {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  timeEstimate: string;
  completed: boolean;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const res = await fetch("/api/goals/my");
        const data = await res.json();
        setGoals(data.goals || []);
      } catch (err) {
        console.error("Failed to fetch goals:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGoals();
  }, []);

  const currentGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);

  return (
    <div className="p-6 sm:p-12 max-w-5xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Goals</h1>
        <Link
          href="/goals/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Goal
        </Link>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">Current Goals</h2>
        {loading ? (
          <p>Loading...</p>
        ) : currentGoals.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No active goals yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Completed Goals</h2>
        {completedGoals.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} completed />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No completed goals yet.</p>
        )}
      </section>
    </div>
  );
}
