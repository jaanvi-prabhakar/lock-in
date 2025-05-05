import React from "react";
import { motion } from "framer-motion";

interface XPBadgeProps {
  xp: number;
  level: number;
}

export default function XPBadge({ xp, level }: XPBadgeProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-xs uppercase tracking-widest">Level {level}</div>
      <div className="text-lg font-bold">{xp} XP</div>
    </motion.div>
  );
}