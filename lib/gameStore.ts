import { create } from 'zustand';

export type Answer = 'yes' | 'no' | 'maybe';
export type Mood = 'curious' | 'focused' | 'smug' | 'panic' | 'celebrating' | 'defeated';

export interface QuestionHistory {
  question: string;
  answer: Answer;
}

export interface GameState {
  mode: 'player' | 'team' | 'match' | null;
  history: QuestionHistory[];
  currentQuestion: string | null;
  mood: Mood;
  confidence: number;
  status: 'idle' | 'playing' | 'win' | 'loss';
  timeLeft: number;
  loading: boolean;
  bestGuess: string | null;

  // Actions
  setMode: (mode: 'player' | 'team' | 'match') => void;
  startGame: (initialQuestion: string) => void;
  setNextQuestion: (q: string, mood: Mood, confidence: number, guess: string | null) => void;
  addAnswer: (answer: Answer) => void;
  setLoading: (loading: boolean) => void;
  endGame: (status: 'win' | 'loss') => void;
  tickTimer: () => void;
  resetGame: () => void;
}

const INITIAL_TIME = 120; // 2 minutes

export const useGameStore = create<GameState>((set) => ({
  mode: null,
  history: [],
  currentQuestion: null,
  mood: 'curious',
  confidence: 0,
  status: 'idle',
  timeLeft: INITIAL_TIME,
  loading: false,
  bestGuess: null,

  setMode: (mode) => set({ mode }),
  
  startGame: (initialQuestion) => 
    set({
      status: 'playing',
      history: [],
      currentQuestion: initialQuestion,
      mood: 'curious',
      confidence: 0,
      timeLeft: INITIAL_TIME,
      loading: false,
      bestGuess: null,
    }),

  setNextQuestion: (q, mood, confidence, guess) => 
    set({
      currentQuestion: q,
      mood,
      confidence,
      bestGuess: guess,
      loading: false,
    }),

  addAnswer: (answer) =>
    set((state) => {
      if (!state.currentQuestion) return state;
      return {
        history: [...state.history, { question: state.currentQuestion, answer }],
        currentQuestion: null,
      };
    }),

  setLoading: (loading) => set({ loading }),
  
  endGame: (status) => set({ status }),
  
  tickTimer: () => 
    set((state) => {
      if (state.status !== 'playing' || state.timeLeft <= 0) return state;
      if (state.timeLeft === 1) {
        return { timeLeft: 0, status: 'loss', mood: 'defeated' };
      }
      return { timeLeft: state.timeLeft - 1 };
    }),
    
  resetGame: () => 
    set({
      history: [],
      currentQuestion: null,
      mood: 'curious',
      confidence: 0,
      status: 'idle',
      timeLeft: INITIAL_TIME,
      loading: false,
      bestGuess: null,
    }),
}));
