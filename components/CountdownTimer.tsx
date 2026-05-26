'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  timeLeft: number;
  onTick: () => void;
  status: 'idle' | 'playing' | 'win' | 'loss';
}

export default function CountdownTimer({ timeLeft, onTick, status }: CountdownTimerProps) {
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        onTick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, timeLeft, onTick]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isWarning = timeLeft <= 30;

  if (status === 'idle') return null;

  return (
    <div className="absolute top-4 right-4 flex items-center bg-[#1a2236] border border-gray-700 px-4 py-2 rounded-full shadow-lg">
      <motion.div 
        className={`w-3 h-3 rounded-full mr-3 ${isWarning ? 'bg-red-500' : 'bg-green-500'}`}
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ repeat: Infinity, duration: isWarning ? 0.5 : 1 }}
      />
      <span className={`font-mono font-bold text-lg ${isWarning ? 'text-red-500' : 'text-white'}`}>
        {formattedTime}
      </span>
    </div>
  );
}
