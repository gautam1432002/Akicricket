'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface QuestionBubbleProps {
  text: string;
  moodText?: string;
  loading?: boolean;
}

export default function QuestionBubble({ text, moodText, loading }: QuestionBubbleProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (loading) {
      setDisplayedText('');
      return;
    }

    let i = 0;
    setDisplayedText('');
    
    // Snappy typewriter effect: 25ms per letter instead of 40ms, making it feel faster!
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
      }
    }, 20);

    return () => clearInterval(intervalId);
  }, [text, loading]);

  return (
    <div className="relative w-full px-2">
      <motion.div 
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="glass-panel rounded-3xl p-6 shadow-xl border border-white/60 relative overflow-hidden"
      >
        {/* Subtle decorative top background gradient light */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60" />

        {loading ? (
          <div className="flex space-x-2.5 justify-center items-center h-14">
            <motion.div 
              className="w-2.5 h-2.5 bg-indigo-500 rounded-full" 
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} 
              transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} 
            />
            <motion.div 
              className="w-2.5 h-2.5 bg-purple-500 rounded-full" 
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} 
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.25 }} 
            />
            <motion.div 
              className="w-2.5 h-2.5 bg-pink-500 rounded-full" 
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} 
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.5 }} 
            />
            <span className="ml-2 text-slate-500 font-medium text-sm tracking-wide">Aki is reading your thoughts...</span>
          </div>
        ) : (
          <div className="flex flex-col min-h-[56px] justify-center">
            <p className="text-slate-800 text-lg md:text-xl font-bold leading-relaxed typewriter-cursor">
              {displayedText}
            </p>
            {moodText && displayedText.length === text.length && (
              <motion.p 
                initial={{ opacity: 0, y: 4 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.3 }}
                className="text-indigo-600 text-xs md:text-sm font-semibold tracking-wide mt-2"
              >
                🧞 &ldquo;{moodText}&rdquo;
              </motion.p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
