'use client'

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/database/db";
import { goals } from "@/database/goals";
import { eq } from "drizzle-orm";
import { useEffect, useState } from 'react'

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([])
  const [newGoal, setNewGoal] = useState('')

  useEffect(() => {
    async function fetchGoals() {
      const res = await fetch('/api/goals/my')
      const data = await res.json()
      if (!Array.isArray(data)) {
        console.error("Expected array from /api/goals/my, but got:", data)
        return
      }
      setGoals(data)
    }
    fetchGoals()
  }, [])

  async function handleAddGoal(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/goals/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newGoal })
    })
    if (!res.ok) return alert('Error creating goal')
    const added = await res.json()
    setGoals([...goals, added.goal])
    setNewGoal('')
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Goals</h1>
      <form onSubmit={handleAddGoal} className="mb-6">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="New goal"
          className="border p-2 mr-2"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      <ul className="space-y-2">
        {goals.map((goal) => (
          <li key={goal.id} className="border p-4 rounded">{goal.title}</li>
        ))}
      </ul>
    </main>
  )
}