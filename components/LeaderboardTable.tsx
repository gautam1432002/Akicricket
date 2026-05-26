'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Trophy, Medal, Flame } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  displayName: string;
  winStreak: number;
  totalWins: number;
  fastestWin: number;
}

export default function LeaderboardTable() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'leaderboard'),
      orderBy('winStreak', 'desc'),
      limit(5) // Limit to 5 for neat bento display
    );

    // Real-time listener for instant leaderboard updates!
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: LeaderboardEntry[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as LeaderboardEntry);
      });
      setEntries(data);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to leaderboard:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-2">
        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Syncing Leaderboard...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center text-slate-400 text-sm py-8 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        No entries yet. Be the first to win! 🏆
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-y-auto max-h-[220px] pr-1">
        <div className="space-y-2">
          {entries.map((entry, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            return (
              <div 
                key={entry.id} 
                className="flex items-center justify-between p-2.5 rounded-2xl bg-white/40 hover:bg-white/80 border border-slate-200/40 hover:border-slate-200/80 transition-all duration-200 group"
              >
                {/* Left side: Rank & Avatar & Name */}
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 text-center">
                    {isFirst ? <Trophy className="mx-auto text-amber-500 fill-amber-500/20" size={18} /> :
                     isSecond ? <Medal className="mx-auto text-slate-400 fill-slate-400/10" size={18} /> :
                     isThird ? <Medal className="mx-auto text-amber-700 fill-amber-700/10" size={18} /> :
                     <span className="text-xs font-bold text-slate-400">{index + 1}</span>}
                  </div>
                  
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {entry.displayName.charAt(0).toUpperCase()}
                  </div>
                  
                  <span className="text-sm font-bold text-slate-700 truncate max-w-[100px] group-hover:text-slate-900 transition-colors">
                    {entry.displayName}
                  </span>
                </div>

                {/* Right side: Streak & Fastest */}
                <div className="flex items-center space-x-3 text-right">
                  <div className="flex items-center space-x-1 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                    <Flame className="text-orange-500 fill-orange-500/20 animate-pulse" size={13} />
                    <span className="text-xs font-extrabold text-orange-600">{entry.winStreak}</span>
                  </div>
                  
                  <div className="hidden sm:block text-[11px] font-semibold text-slate-400">
                    Fastest: <span className="font-extrabold text-indigo-600">{entry.fastestWin}Q</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
