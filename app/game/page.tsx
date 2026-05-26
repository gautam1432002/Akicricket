'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GameRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect /game to / because the game is now played directly on the home screen!
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold text-sm tracking-wide">Loading Aki-Cricket...</p>
      </div>
    </div>
  );
}
