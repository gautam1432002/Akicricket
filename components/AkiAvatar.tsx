'use client';

import { motion } from 'framer-motion';
import { Mood } from '@/lib/gameStore';

interface AkiAvatarProps {
  mood: Mood;
}

const moodConfig = {
  curious: { color: 'border-blue-400', emoji: '🧞', animation: { y: [0, -10, 0] } },
  focused: { color: 'border-purple-500', emoji: '🧞‍♂️', animation: { scale: [1, 1.05, 1] } },
  smug: { color: 'border-orange-500', emoji: '😏', animation: { rotate: [-5, 5, -5] } },
  panic: { color: 'border-red-500', emoji: '😰', animation: { x: [-5, 5, -5] } },
  celebrating: { color: 'border-yellow-400', emoji: '🎉', animation: { rotate: [0, 360], scale: [1, 1.2, 1] } },
  defeated: { color: 'border-gray-500', emoji: '😵', animation: { y: [0, 10, 0], opacity: [1, 0.7, 1] } },
};

export default function AkiAvatar({ mood }: AkiAvatarProps) {
  const config = moodConfig[mood];

  return (
    <div className="relative flex justify-center items-center">
      <motion.div
        className={`w-32 h-32 rounded-full border-4 ${config.color} bg-[#1a2236] flex items-center justify-center shadow-lg shadow-${config.color}/20`}
        animate={config.animation}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="text-6xl select-none">{config.emoji}</span>
      </motion.div>
    </div>
  );
}
