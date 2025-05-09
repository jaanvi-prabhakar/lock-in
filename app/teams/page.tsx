"use client";

import { useState } from "react"
import { createTeam, joinTeam } from "@/actions/teams"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TeamsPage() {
  const [createError, setCreateError] = useState("")
  const [joinError, setJoinError] = useState("")
  const [inviteCode, setInviteCode] = useState("")

  const teamMembers = [
    { name: "Audrey", xp: 1250 },
    { name: "Xiaochen", xp: 980 },
    { name: "Jaanvi", xp: 860 },
  ];

  const leaderboard = [
    { team: "Lock-In Legends", xp: 3090 },
    { team: "Code Crushers", xp: 2890 },
    { team: "Bug Slayers", xp: 2700 },
  ];

  const totalTeamXP = teamMembers.reduce((sum, member) => sum + member.xp, 0);
  const teamGoalXP = 5000;

  async function handleCreateTeam(formData: FormData) {
    const result = await createTeam(formData)
    if (result.error) {
      setCreateError(result.error)
    } else {
      setCreateError("")
      setInviteCode(result.inviteCode)
    }
  }

  async function handleJoinTeam(formData: FormData) {
    const result = await joinTeam(formData)
    if (result.error) {
      setJoinError(result.error)
    } else {
      setJoinError("")
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Create Team Form */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Create a New Team</h2>
          <form action={handleCreateTeam} className="space-y-4">
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                Team Name
              </label>
              <Input
                id="teamName"
                name="teamName"
                type="text"
                required
                placeholder="Enter team name"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">
              Create Team
            </Button>
            {createError && (
              <p className="text-red-500 text-sm mt-2">{createError}</p>
            )}
            {inviteCode && (
              <div className="mt-4 p-4 bg-green-50 rounded-md">
                <p className="text-green-800 font-medium">Team created successfully!</p>
                <p className="text-sm text-green-700 mt-1">
                  Invite Code: <span className="font-mono">{inviteCode}</span>
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Join Team Form */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Join a Team</h2>
          <form action={handleJoinTeam} className="space-y-4">
            <div>
              <label htmlFor="teamCode" className="block text-sm font-medium text-gray-700">
                Team Code
              </label>
              <Input
                id="teamCode"
                name="teamCode"
                type="text"
                required
                placeholder="Enter team invite code"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">
              Join Team
            </Button>
            {joinError && (
              <p className="text-red-500 text-sm mt-2">{joinError}</p>
            )}
          </form>
        </div>
      </div>

      <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Team</h1>

        <section className="mb-8 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Team: Lock-In Legends</h2>
          <p className="text-gray-600 mb-2">Invite Code: <span className="font-mono text-blue-700">ABC123</span></p>
          <p className="text-gray-600 mb-2">Total Team XP: <strong>{totalTeamXP}</strong> / {teamGoalXP}</p>

          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${(totalTeamXP / teamGoalXP) * 100}%` }}
            />
          </div>
        </section>

        <section className="mb-8 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          <ul className="space-y-2">
            {teamMembers.map((member, index) => (
              <li key={index} className="flex justify-between text-gray-700">
                <span>{member.name}</span>
                <span>{member.xp} XP</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
          <ol className="space-y-2">
            {leaderboard.map((entry, index) => (
              <li key={index} className="flex justify-between text-gray-700">
                <span>
                  {index + 1}. {entry.team}
                </span>
                <span>{entry.xp} XP</span>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}
