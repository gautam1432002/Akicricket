import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT, genAI as defaultGenAI } from '@/lib/gemini';
import { runAkinatorEngine } from '@/lib/ipl-entities';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const headers = req.headers;
  const customApiKey = headers.get('x-gemini-key');
  const envApiKey = process.env.GEMINI_API_KEY;

  const effectiveApiKey = (customApiKey && customApiKey.startsWith('AIzaSy'))
    ? customApiKey
    : (envApiKey && envApiKey.startsWith('AIzaSy'))
      ? envApiKey
      : null;

  const body = await req.json();
  const { history, questionNumber, mode } = body;

  const safeMode: 'player' | 'team' | 'match' =
    mode === 'team' ? 'team' : mode === 'match' ? 'match' : 'player';

  // ── Step 1: Run the local Akinator engine (always works, no API needed) ───
  const engineResult = runAkinatorEngine(safeMode, history || []);

  // If local engine has an extremely confident final guess, return it immediately to conclude the game
  if (engineResult.confidence >= 87 && engineResult.guess && !effectiveApiKey) {
    return NextResponse.json({
      question: engineResult.question,
      mood: engineResult.mood,
      confidence: engineResult.confidence,
      guess: engineResult.guess,
    });
  }

  // ── Step 2 (Optional): Enhance with Gemini if a key is available ─
  if (effectiveApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(effectiveApiKey);
      const mappedMode =
        safeMode === 'player' ? 'IPL Cricketer' :
        safeMode === 'team' ? 'IPL Franchise' : 'Historic IPL Match';

      let ctx = `Game Mode: ${mappedMode}\nQuestion Number: ${questionNumber} out of 15\n\n`;
      ctx += `CRITICAL RULES:\n`;
      ctx += `- NEVER ask "Is the entity a player/team/match?" — you already know the mode.\n`;
      ctx += `- NEVER repeat a question already asked.\n`;
      ctx += `- Focus on narrow, specific attributes (e.g., franchise, nationality, era).\n\n`;

      if (history?.length > 0) {
        ctx += 'History of questions and answers:\n';
        history.forEach((h: any, i: number) => {
          ctx += `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}\n\n`;
        });
      }

      ctx += `Local engine suggests next question: "${engineResult.question}"\n`;
      if (engineResult.guess) {
        ctx += `Local engine's top guess: "${engineResult.guess}" (confidence: ${engineResult.confidence}%)\n`;
      }
      ctx += `\nOutput ONLY valid JSON matching the format. Do NOT wrap in markdown.\n`;

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
      });

      const result = await model.generateContent(ctx);
      const text = result.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      // Sanity-check the Gemini response — never let it repeat a question
      const askedQuestions = (history || []).map((h: any) => h.question);
      if (parsed.question && askedQuestions.includes(parsed.question)) {
        parsed.question = engineResult.question;
      }

      // Merge: prefer local guess over Gemini's if our confidence is higher
      if (engineResult.guess && (engineResult.confidence > (parsed.confidence || 0))) {
        parsed.guess = engineResult.guess;
        parsed.confidence = engineResult.confidence;
      }

      return NextResponse.json(parsed);
    } catch (apiError: any) {
      const msg = apiError?.message || '';
      if (msg.includes('429') || msg.includes('quota') || msg.includes('Quota')) {
        // Quota hit — silently serve local result with a soft warning
        return NextResponse.json({
          ...engineResult,
          warning: 'quota_exceeded',
        });
      }
      // Any other Gemini error — silently fall through to local result
      console.warn('Gemini API error (non-fatal, using local engine):', msg.slice(0, 120));
    }
  }

  // ── Step 3: Return the pure local engine result (default path) ───────────
  return NextResponse.json({
    question: engineResult.question,
    mood: engineResult.mood,
    confidence: engineResult.confidence,
    guess: engineResult.guess,
  });
}
