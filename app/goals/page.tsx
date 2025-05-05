"use client";

import { useEffect, useState } from "react";
import GoalCard from "@/components/GoalCard";

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
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    difficulty: "",
    timeEstimate: "",
  });

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
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {showForm ? "Cancel" : "+ Add Goal"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              console.log("Submitting new goal:", newGoal);
              const res = await fetch("/api/goals/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newGoal),
                cache: "no-store",
              });
              console.log("Response:", res);
              if (!res.ok) {
                throw new Error("Failed to create goal");
              }
              const data = await res.json();
              if (data.goal) {
                setGoals((prevGoals) => [...prevGoals, data.goal]);
                setShowForm(false);
                setNewGoal({ title: "", description: "", difficulty: "", timeEstimate: "" });
              } else {
                console.error("No goal returned from API:", data);
              }
            } catch (err) {
              console.error("Failed to add goal:", err);
            }
          }}
          className="space-y-4 bg-white border p-4 rounded shadow-md"
        >
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              className="w-full border p-2 rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              className="w-full border p-2 rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Difficulty</label>
            <input
              type="text"
              value={newGoal.difficulty}
              onChange={(e) => setNewGoal({ ...newGoal, difficulty: e.target.value })}
              className="w-full border p-2 rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Time Estimate</label>
            <input
              type="text"
              value={newGoal.timeEstimate}
              onChange={(e) => setNewGoal({ ...newGoal, timeEstimate: e.target.value })}
              className="w-full border p-2 rounded text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Submit
          </button>
        </form>
      )}

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
