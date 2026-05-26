'use client';

import { motion } from 'framer-motion';
import { Answer } from '@/lib/gameStore';
import { Check, X, HelpCircle } from 'lucide-react';

interface AnswerButtonsProps {
  onAnswer: (answer: Answer) => void;
  disabled: boolean;
}

export default function AnswerButtons({ onAnswer, disabled }: AnswerButtonsProps) {
  return (
    <div className="flex flex-row justify-center items-center gap-3 md:gap-4 mt-6 w-full max-w-md px-2">
      {/* Yes Button */}
      <motion.button
        whileHover={!disabled ? { y: -2, scale: 1.03 } : {}}
        whileTap={!disabled ? { scale: 0.97 } : {}}
        disabled={disabled}
        onClick={() => onAnswer('yes')}
        className={`flex-1 py-3.5 rounded-2xl font-bold text-base md:text-lg flex flex-col items-center justify-center gap-1.5 transition-all duration-200 border-2 ${
          disabled 
            ? 'bg-slate-100/50 border-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/10'
        }`}
      >
        <Check size={20} className="stroke-[3px]" />
        <span>Yes</span>
      </motion.button>
      
      {/* Maybe Button */}
      <motion.button
        whileHover={!disabled ? { y: -2, scale: 1.03 } : {}}
        whileTap={!disabled ? { scale: 0.97 } : {}}
        disabled={disabled}
        onClick={() => onAnswer('maybe')}
        className={`flex-1 py-3.5 rounded-2xl font-bold text-base md:text-lg flex flex-col items-center justify-center gap-1.5 transition-all duration-200 border-2 ${
          disabled 
            ? 'bg-slate-100/50 border-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-amber-500/5 border-amber-500/20 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:shadow-md hover:shadow-amber-500/10'
        }`}
      >
        <HelpCircle size={20} className="stroke-[3px]" />
        <span>Maybe</span>
      </motion.button>

      {/* No Button */}
      <motion.button
        whileHover={!disabled ? { y: -2, scale: 1.03 } : {}}
        whileTap={!disabled ? { scale: 0.97 } : {}}
        disabled={disabled}
        onClick={() => onAnswer('no')}
        className={`flex-1 py-3.5 rounded-2xl font-bold text-base md:text-lg flex flex-col items-center justify-center gap-1.5 transition-all duration-200 border-2 ${
          disabled 
            ? 'bg-slate-100/50 border-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-rose-500/5 border-rose-500/20 text-rose-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-md hover:shadow-rose-500/10'
        }`}
      >
        <X size={20} className="stroke-[3px]" />
        <span>No</span>
      </motion.button>
    </div>
  );
}
