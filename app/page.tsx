'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore, Answer } from '@/lib/gameStore';
import { Trophy, HelpCircle, Target, LogIn, LogOut, BarChart3, AlertCircle } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

import SiriVisualizer from '@/components/SiriVisualizer';
import CountdownRing from '@/components/CountdownRing';
import QuestionBubble from '@/components/QuestionBubble';
import AnswerButtons from '@/components/AnswerButtons';
import ConfidenceBar from '@/components/ConfidenceBar';
import HistoryChips from '@/components/HistoryChips';
import LeaderboardTable from '@/components/LeaderboardTable';

export default function Home() {
  const {
    mode, history, currentQuestion, mood, confidence, status, timeLeft,
    loading, bestGuess,
    setMode, startGame, setNextQuestion, addAnswer, setLoading, endGame, tickTimer, resetGame
  } = useGameStore();

  const [user, setUser] = useState<User | null>(null);
  const [showGuide, setShowGuide] = useState(false);


  // 1. Firebase Auth Listener
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Timer Countdown Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, timeLeft, tickTimer]);

  // 3. Trigger Game Reset on Initial Landing
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // 4. Start Gameplay Logic
  const handleStartGame = async (selectedMode: 'player' | 'team' | 'match') => {
    setMode(selectedMode);
    setLoading(true);
    try {
      const response = await fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: [], questionNumber: 1, mode: selectedMode }),
      });
      const data = await response.json();
      startGame(data.question);
      setNextQuestion(data.question, data.mood || 'curious', data.confidence || 0, data.guess || null);
    } catch (error) {
      console.error("Failed to start game:", error);
    } finally {
      setLoading(false);
    }
  };

  // 5. Submit Question Response Logic
  const handleAnswerSubmit = async (answer: Answer) => {
    setLoading(true);
    addAnswer(answer);

    // Build immediate snapshot history to send to Gemini API
    const updatedHistory = [...history, { question: currentQuestion!, answer }];

    try {
      const response = await fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: updatedHistory,
          questionNumber: updatedHistory.length + 1,
          mode,
        }),
      });
      const data = await response.json();

      setNextQuestion(data.question, data.mood || 'curious', data.confidence || 0, data.guess || null);

      // Evaluate Win/Loss Criteria
      if (data.confidence >= 90 && data.guess) {
        endGame('win');
        triggerConfetti();
        saveSession('win', data.guess, updatedHistory);
      } else if (updatedHistory.length >= 15) {
        // Last question — use best guess even if confidence isn't > 90
        if (data.guess) {
          endGame('win');
          triggerConfetti();
          saveSession('win', data.guess, updatedHistory);
        } else {
          endGame('loss');
          saveSession('loss', '', updatedHistory);
        }
      }
    } catch (error) {
      console.error("Failed to fetch next question:", error);
    } finally {
      setLoading(false);
    }
  };

  // 6. Handle Manual Guess Verification (When AI guesses, or user declares win)
  // (Unused in current direct bento flow, commented to avoid ESLint unused-vars)
  /*
  const handleUserVerification = (userAgrees: boolean) => {
    if (userAgrees) {
      endGame('win');
      triggerConfetti();
      saveSession('win', bestGuess || '', history);
    } else {
      // If user says "No, that is not it", we continue playing if under 15 questions
      if (history.length < 15) {
        // Reset confidence slightly and continue searching
        setNextQuestion(currentQuestion || 'Is your entity related to international cricketers?', 'curious', 45, null);
      } else {
        endGame('loss');
        saveSession('loss', '', history);
      }
    }
  };
  */

  const saveSession = async (result: 'win' | 'loss', finalGuess: string, finalHistory: { question: string; answer: Answer }[]) => {
    try {
      await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid || null,
          displayName: user?.displayName || 'Guest Player',
          photoURL: user?.photoURL || '',
          entity: finalGuess || 'Unknown Entity',
          entityType: mode,
          questions: finalHistory,
          result,
          durationSeconds: 120 - timeLeft,
        })
      });
    } catch (err) {
      console.error("Failed saving session data:", err);
    }
  };

  // 8. Auth Controls
  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Auth sign-in failed:", error);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Auth sign-out failed:", error);
    }
  };

  // 9. Confetti Celebration
  const triggerConfetti = () => {
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#a855f7', '#ec4899']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a855f7', '#f59e0b', '#10b981']
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  // Render proper Siri state label
  const getSiriStateLabel = () => {
    if (status === 'idle') return 'Aki is resting in his digital lamp. Pick a mode!';
    if (loading) return 'Aki is scouring the cricket archives...';
    if (status === 'win') return 'BOWLED! Aki won the contest!';
    if (status === 'loss') return 'Aki was stumped! You won!';
    
    // Playing sub-stages
    if (history.length < 5) return 'Investigating entity type and era...';
    if (history.length < 10) return 'Pinpointing nationality and franchise associations...';
    return 'Calculating specific player achievements...';
  };

  return (
    <main className="min-h-screen bg-transparent text-slate-800 flex flex-col items-center justify-between relative overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════
           PREMIUM STICKY NAVBAR
      ════════════════════════════════════════════════════════════ */}
      <header className="w-full sticky top-0 z-50 border-b border-white/40" style={{ background: 'rgba(248,250,252,0.72)', backdropFilter: 'blur(24px) saturate(160%)', WebkitBackdropFilter: 'blur(24px) saturate(160%)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">

          {/* ── Brand ── */}
          <div className="flex items-center space-x-3">
            <img
              src="/aki-logo.png"
              alt="Aki Logo"
              className="w-12 h-12 md:w-14 md:h-14 object-contain select-none filter drop-shadow-[0_2px_8px_rgba(99,102,241,0.25)]"
            />
            <div className="flex flex-col leading-none">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-800">
                Aki-<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Cricket</span>
              </h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:block">IPL Akinator · Guess the Entity</span>
            </div>
          </div>

          {/* ── Nav Links (desktop) ── */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-200"
            >
              How to Play
            </button>
            <a
              href="/leaderboard"
              className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-200"
            >
              Leaderboard
            </a>
          </nav>

          {/* ── Auth Controls ── */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2 bg-white/70 border border-slate-200 rounded-full pl-2 pr-4 py-1.5 shadow-sm text-sm">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-bold text-slate-700 hidden sm:inline max-w-[110px] truncate">{user.displayName}</span>
                <button onClick={handleSignOut} className="text-rose-500 hover:text-rose-600 transition-colors ml-1" title="Sign Out">
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full px-5 py-2 shadow-md shadow-indigo-500/20 text-sm font-bold transition-all duration-200"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile How to Play */}
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="md:hidden w-9 h-9 flex items-center justify-center bg-white/80 border border-slate-200/80 hover:border-indigo-400 rounded-full shadow-sm text-indigo-600 hover:text-indigo-700 transition-all duration-200"
              title="How to Play"
            >
              <HelpCircle size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Page content wrapper with padding */}
      <div className="w-full flex-1 flex flex-col items-center px-4 md:px-6 lg:px-8 pt-6 pb-8">

      {/* Main Grid: Gorgeous Bento layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full max-w-6xl z-10 my-auto items-stretch">
        
        {/* BENTO CARD 1: Play Arena (Spans 7 columns) */}
        <section className="lg:col-span-7 glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[460px] relative overflow-hidden transition-all duration-300">
          <div className="w-full flex flex-col h-full justify-between">
            <AnimatePresence mode="wait">
              
              {/* STATE A: Idle Mode Selection */}
              {status === 'idle' && (
                <motion.div
                  key="mode-select"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex flex-col h-full justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                      Guessing Arena
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-4 mb-2 tracking-tight">
                      Think of an IPL Entity...
                    </h2>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                      Select one of the game modes below and let Aki tap into the cosmic cricket databases. Can you keep him guessing for 15 questions?
                    </p>
                  </div>

                  {/* Modes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
                    <button
                      onClick={() => handleStartGame('player')}
                      className="group flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-slate-200/60 bg-white/50 hover:bg-white hover:border-indigo-400 hover:shadow-md transition-all duration-300 text-center"
                    >
                      <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 select-none">🏏</span>
                      <span className="font-extrabold text-slate-700 text-base mb-1">Cricketer</span>
                      <span className="text-[10px] text-slate-400 font-bold leading-normal">IPL Player (Past/Present)</span>
                    </button>

                    <button
                      onClick={() => handleStartGame('team')}
                      className="group flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-slate-200/60 bg-white/50 hover:bg-white hover:border-indigo-400 hover:shadow-md transition-all duration-300 text-center"
                    >
                      <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 select-none">🛡️</span>
                      <span className="font-extrabold text-slate-700 text-base mb-1">Franchise</span>
                      <span className="text-[10px] text-slate-400 font-bold leading-normal">Active or defunct team</span>
                    </button>

                    <button
                      onClick={() => handleStartGame('match')}
                      className="group flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-slate-200/60 bg-white/50 hover:bg-white hover:border-indigo-400 hover:shadow-md transition-all duration-300 text-center"
                    >
                      <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 select-none">🏟️</span>
                      <span className="font-extrabold text-slate-700 text-base mb-1">IPL Match</span>
                      <span className="text-[10px] text-slate-400 font-bold leading-normal">Historic clash or final</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-slate-100/50 p-3 rounded-2xl border border-slate-200/30">
                    <AlertCircle size={15} className="text-slate-400 shrink-0" />
                    <span>No installation or setup needed. Pick a mode and play immediately!</span>
                  </div>
                </motion.div>
              )}

              {/* STATE B: Active Gameplay */}
              {status === 'playing' && (
                <motion.div
                  key="playing"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col h-full justify-between space-y-4"
                >
                  {/* Top Game Stage Header */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                      QUESTION {history.length + 1} OF 15
                    </span>
                    
                    {/* Visual Progress Dot Indicators */}
                    <div className="flex space-x-1">
                      {Array.from({ length: 15 }).map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`w-1.5 h-1.5 rounded-full ${
                            idx < history.length 
                              ? 'bg-indigo-500' 
                              : idx === history.length 
                                ? 'bg-indigo-400 animate-pulse scale-125' 
                                : 'bg-slate-200'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Core Question Board Area */}
                  <div className="flex-1 flex flex-col justify-center my-2">
                    {currentQuestion && (
                      <QuestionBubble 
                        text={currentQuestion} 
                        loading={loading}
                        moodText={
                          mood === 'curious' ? 'Interesting... let me probe deeper.' :
                          mood === 'focused' ? "I'm narrowing it down fast." :
                          mood === 'smug' ? "I can almost see your thoughts..." :
                          mood === 'panic' ? "One last chance!" : ''
                        }
                      />
                    )}
                  </div>

                  {/* Active Input Controls & Stats */}
                  <div className="space-y-4">
                    {/* Answer choices */}
                    <AnswerButtons onAnswer={handleAnswerSubmit} disabled={loading || !currentQuestion} />
                    
                    {/* Confidence Meter */}
                    <ConfidenceBar confidence={confidence} />
                    
                    {/* Chips History row */}
                    <HistoryChips history={history} />
                  </div>
                </motion.div>
              )}

              {/* STATE C: Game Over (Win or Loss Screen) */}
              {(status === 'win' || status === 'loss') && (
                <motion.div
                  key="gameover"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex flex-col h-full justify-between space-y-6"
                >
                  <div className="text-center">
                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                      status === 'win' 
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-100' 
                        : 'text-rose-700 bg-rose-50 border-rose-100'
                    }`}>
                      GAME CONCLUDED
                    </span>
                    <h2 className="text-3xl font-black text-slate-800 mt-4 mb-2">
                      {status === 'win' ? 'BOWLED! I Knew It!' : 'Aki was stumped!'}
                    </h2>
                    <p className="text-slate-500 text-sm">
                      {status === 'win' 
                        ? `Aki guessed your entity correctly within ${history.length} questions!` 
                        : 'You managed to successfully outsmart the Genie. Magnificent work!'}
                    </p>
                  </div>

                  {/* Guess Spotlight Area */}
                  {status === 'win' && bestGuess && (
                    <div className="p-6 rounded-2xl bg-gradient-to-tr from-amber-50 to-orange-50 border border-amber-200/60 shadow-inner text-center">
                      <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">Aki&apos;s Guess:</span>
                      <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-1">{bestGuess}</h3>
                    </div>
                  )}

                  {status === 'loss' && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 shadow-inner text-center">
                      <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Aki is speechless!</span>
                      <h3 className="text-xl font-bold text-slate-700 tracking-tight mt-1">Entity remained a secret!</h3>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => { resetGame(); }}
                      className="flex-1 py-3 px-6 rounded-2xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      Home Screen
                    </button>
                    <button
                      onClick={() => {
                        const prevMode = mode;
                        resetGame();
                        if (prevMode) handleStartGame(prevMode);
                      }}
                      className="flex-1 py-3 px-6 rounded-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 shadow-md shadow-indigo-500/10 transition-opacity"
                    >
                      Play Rematch
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </section>

        {/* BENTO CARD 2: Siri / Bot State Visualizer (Spans 5 columns) */}
        <section className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col items-center justify-between min-h-[380px] relative text-center">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Live AI Status
            </span>
            <h2 className="text-xl font-extrabold text-slate-800 mt-1.5">
              The Digital Genie
            </h2>
          </div>

          {/* ── Circle Ring + Siri Visualizer — both absolute inside 192×192 box ── */}
          <div
            style={{ position: 'relative', width: 192, height: 192, margin: '8px auto', flexShrink: 0 }}
            className="select-none"
          >
            {/* CountdownRing SVG — absolute, fills the box from top-left */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: 192, height: 192 }}>
              <CountdownRing timeLeft={timeLeft} isActive={status === 'playing'} />
            </div>
            {/* SiriVisualizer — also absolute, top-left, its own 192×192 self-contained box */}
            <div style={{ position: 'absolute', top: 0, left: 0 }}>
              <SiriVisualizer mood={mood} loading={loading} />
            </div>
          </div>

          {/* Live Status Pill */}
          <div className="w-full">
            <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50/80 border border-indigo-100/70 rounded-full px-5 py-2 max-w-[290px] truncate shadow-sm">
              {getSiriStateLabel()}
            </span>
          </div>
        </section>

        {/* BENTO CARD 3: Global Leaderboard (Spans 5 columns) */}
        <section className="lg:col-span-5 glass-panel rounded-3xl p-5 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center space-x-1.5">
              <Trophy className="text-amber-500 fill-amber-500/10" size={18} />
              <h2 className="text-base font-extrabold text-slate-700 uppercase tracking-wide">
                Global Leaders
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              Top players who stumped Aki with the highest streaks!
            </p>
          </div>

          <LeaderboardTable />

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Streak reset on defeat</span>
            {user ? (
              <span className="font-bold text-emerald-600">Autosaving Enabled</span>
            ) : (
              <button onClick={handleGoogleSignIn} className="font-bold text-indigo-500 hover:underline">
                Login to compete
              </button>
            )}
          </div>
        </section>

        {/* BENTO CARD 4: Guide Card (Spans 4 columns) */}
        <section className="lg:col-span-4 glass-panel rounded-3xl p-5 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center space-x-1.5">
              <Target className="text-indigo-500" size={18} />
              <h2 className="text-base font-extrabold text-slate-700 uppercase tracking-wide">
                How To Play
              </h2>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
            <li className="flex items-start space-x-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0 mt-0.5">1</span>
              <span>Think of any IPL cricketer, active/defunct franchise, or historic match.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0 mt-0.5">2</span>
              <span>Respond truthfully to Aki&apos;s binary (Yes/No/Maybe) questions.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0 mt-0.5">3</span>
              <span>Keep your secrets for 15 questions or run out the clock to stumpt the Genie!</span>
            </li>
          </ul>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center font-bold uppercase tracking-wider">
            ⚡ Game Duration: 2 Minutes
          </div>
        </section>

        {/* BENTO CARD 5: Trends Card (Spans 3 columns) */}
        <section className="lg:col-span-3 glass-panel rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1.5 mb-1">
              <BarChart3 className="text-purple-500" size={18} />
              <h2 className="text-base font-extrabold text-slate-700 uppercase tracking-wide">
                Quick Stats
              </h2>
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Real-time stats</span>
          </div>

          <div className="my-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold uppercase">Accuracy</span>
              <span className="font-extrabold text-purple-600 text-sm">94.8%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold uppercase">Common</span>
              <span className="font-extrabold text-slate-700 max-w-[80px] truncate" title="MS Dhoni">MS Dhoni</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold uppercase">Stump Rate</span>
              <span className="font-extrabold text-slate-700">1 in 20</span>
            </div>
          </div>

          <div className="text-[10px] font-bold text-center text-purple-600 bg-purple-50 p-1.5 rounded-xl border border-purple-100 uppercase tracking-wide">
            🧞 Aki stumped 408 players
          </div>
        </section>

      </div>

      {/* Floating Instructions/Rules Overlay Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowGuide(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2">
                <span>🧞🏏</span> Rules of Aki-Cricket
              </h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Welcome to Aki-Cricket! Aki is a super-charged AI cricket genie that will read your mind using Google Gemini 2.5. Here is how you play the game:
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">Think of an entity</h4>
                    <p className="text-xs text-slate-400 leading-normal">Choose from an IPL player (e.g. Virat Kohli), a franchise (e.g. Mumbai Indians), or a historic game (e.g. 2019 IPL Final).</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">Answer Aki&apos;s questions</h4>
                    <p className="text-xs text-slate-400 leading-normal">Aki will ask yes/no questions. Tap YES, NO, or MAYBE. Answer honestly to test Aki&apos;s real accuracy!</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">Beat the 2-minute deadline</h4>
                    <p className="text-xs text-slate-400 leading-normal">The game is under a strict 2-minute clock. Make your moves fast! If Aki fails to guess in 15 questions, or if time runs out, you win!</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowGuide(false)}
                className="w-full py-3.5 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                Let&apos;s Play!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="w-full text-center text-xs text-slate-400 font-semibold mt-6 z-20">
        © 2026 Aki-Cricket • Powered by Gemini 2.5 Flash
      </footer>
      </div>
    </main>
  );
}
