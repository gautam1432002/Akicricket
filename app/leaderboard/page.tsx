'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy } from 'lucide-react';
import LeaderboardTable from '@/components/LeaderboardTable';

export default function Leaderboard() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 relative overflow-hidden text-slate-800">
      {/* Background decorations */}
      <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-96 h-96 bg-pink-200/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl z-10">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center text-slate-500 hover:text-slate-800 font-bold mb-8 transition-colors group text-sm bg-white/70 border border-slate-200/50 rounded-full px-4 py-1.5 shadow-sm"
        >
          <ArrowLeft className="mr-2 group-hover:-translate-x-0.5 transition-transform" size={16} />
          Back to Dashboard
        </button>

        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex p-3 bg-amber-50 rounded-full border border-amber-100/80 mb-3 shadow-inner">
            <Trophy className="text-amber-500 fill-amber-500/10" size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            Global Leaderboard
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base font-semibold">
            Top players who successfully stumped Aki and set the highest win streaks.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-3xl border border-white/60 shadow-xl"
        >
          <LeaderboardTable />
        </motion.div>
      </div>
    </main>
  );
}
