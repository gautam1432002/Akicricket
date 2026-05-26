'use client';

import { motion } from 'framer-motion';

interface ConfidenceBarProps {
  confidence: number;
}

export default function ConfidenceBar({ confidence }: ConfidenceBarProps) {
  // Determine gradient color based on confidence level
  const getGradient = (conf: number) => {
    if (conf < 40) return 'from-indigo-500 to-blue-500 shadow-indigo-500/20';
    if (conf < 75) return 'from-purple-500 to-pink-500 shadow-purple-500/25';
    return 'from-amber-500 to-orange-500 shadow-orange-500/30';
  };

  const isHighConfidence = confidence >= 85;

  return (
    <div className="w-full max-w-md mx-auto mt-6 px-2">
      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5 tracking-wider uppercase">
        <span>Aki&apos;s Confidence</span>
        <span className={isHighConfidence ? 'text-orange-600 font-extrabold animate-pulse' : 'text-slate-700'}>{confidence}%</span>
      </div>
      <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 relative shadow-inner">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${getGradient(confidence)} ${isHighConfidence ? 'shadow-md animate-pulse' : 'shadow-sm'}`}
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Glow shimmer for high confidence */}
        {isHighConfidence && (
          <motion.div 
            className="absolute top-0 left-0 h-full bg-white/40"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            style={{ width: '40%', filter: 'blur(4px)' }}
          />
        )}
      </div>
    </div>
  );
}
