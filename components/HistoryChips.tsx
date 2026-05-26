'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { QuestionHistory } from '@/lib/gameStore';

interface HistoryChipsProps {
  history: QuestionHistory[];
}

export default function HistoryChips({ history }: HistoryChipsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the rightmost element when a new chip is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [history]);

  if (history.length === 0) return null;

  return (
    <div className="w-full mt-6 px-2">
      <div className="text-xs text-slate-400 uppercase font-bold mb-2 tracking-wider pl-1.5">
        Game History
      </div>
      <div 
        ref={scrollRef}
        className="flex space-x-2.5 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {history.map((item, index) => {
          let dotColor = 'bg-amber-400 ring-amber-400/20';
          if (item.answer === 'yes') dotColor = 'bg-emerald-400 ring-emerald-400/20';
          if (item.answer === 'no') dotColor = 'bg-rose-400 ring-rose-400/20';

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.85, x: 15 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              className="flex-shrink-0 bg-slate-50 border border-slate-200/60 rounded-2xl px-3.5 py-1.5 flex items-center space-x-2 text-xs md:text-sm shadow-sm"
            >
              <div className={`w-2 h-2 rounded-full ${dotColor} ring-4`} />
              <span className="text-slate-600 font-semibold max-w-[160px] truncate" title={item.question}>
                Q{index + 1}: {item.question}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
