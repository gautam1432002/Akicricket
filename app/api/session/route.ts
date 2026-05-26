import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
  if (!adminDb) {
    console.warn("Firebase Admin SDK not initialized. Session was not saved to DB.");
    return NextResponse.json({ success: true, message: "Firebase Admin not initialized; running in guest mode." }, { status: 200 });
  }

  try {
    const body = await req.json();
    const { userId, displayName, photoURL, entity, entityType, questions, result, durationSeconds } = body;

    const questionsUsed = questions.length;
    
    // Save the session
    const sessionRef = adminDb.collection('sessions').doc();
    await sessionRef.set({
      userId: userId || 'anonymous',
      entity,
      entityType,
      questions,
      result,
      questionsUsed,
      durationSeconds,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update Leaderboard if userId exists and player won
    if (userId && result === 'win') {
      const userLeaderboardRef = adminDb.collection('leaderboard').doc(userId);
      
      await adminDb.runTransaction(async (transaction) => {
        const doc = await transaction.get(userLeaderboardRef);
        if (!doc.exists) {
          transaction.set(userLeaderboardRef, {
            displayName: displayName || 'Anonymous',
            photoURL: photoURL || '',
            winStreak: 1,
            totalWins: 1,
            totalGames: 1,
            fastestWin: questionsUsed,
            lastPlayed: admin.firestore.FieldValue.serverTimestamp()
          });
        } else {
          const data = doc.data()!;
          transaction.update(userLeaderboardRef, {
            displayName: displayName || data.displayName,
            photoURL: photoURL || data.photoURL,
            winStreak: (data.winStreak || 0) + 1,
            totalWins: (data.totalWins || 0) + 1,
            totalGames: (data.totalGames || 0) + 1,
            fastestWin: Math.min(data.fastestWin || 999, questionsUsed),
            lastPlayed: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      });
    } else if (userId && result === 'loss') {
      // Reset win streak on loss
      const userLeaderboardRef = adminDb.collection('leaderboard').doc(userId);
      await adminDb.runTransaction(async (transaction) => {
        const doc = await transaction.get(userLeaderboardRef);
        if (doc.exists) {
          const data = doc.data()!;
          transaction.update(userLeaderboardRef, {
            winStreak: 0,
            totalGames: (data.totalGames || 0) + 1,
            lastPlayed: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      });
    }

    return NextResponse.json({ success: true, sessionId: sessionRef.id });
  } catch (error) {
    console.error("Error saving session:", error);
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }
}
