import React from "react";
import { motion } from "framer-motion";

interface GoalCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  timeEstimate: string;
  checkedInToday: boolean;
  onCheckIn: (goalId: string) => void;
}

export default function GoalCard({
  id,
  title,
  description,
  difficulty,
  timeEstimate,
  checkedInToday,
  onCheckIn,
}: GoalCardProps) {
  const difficultyColor = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
  }[difficulty];

  return (
    <motion.div
      className="border rounded-lg p-4 shadow-md bg-white flex flex-col gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>

      <div className="flex justify-between text-xs text-gray-600 mt-2">
        <span className={`px-2 py-0.5 rounded ${difficultyColor}`}>{difficulty}</span>
        <span className="italic">⏱ {timeEstimate}</span>
      </div>

      <button
        onClick={() => onCheckIn(id)}
        disabled={checkedInToday}
        className={`mt-3 px-4 py-1 text-sm rounded font-medium text-white transition-colors 
          ${checkedInToday ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {checkedInToday ? "Checked In ✅" : "Check In"}
      </button>
    </motion.div>
  );
}