import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

export interface RankingRecord {
  id?: string;
  name: string;
  score: number;
  wins: number;
  draws: number;
  losses: number;
  time: number;
  createdAt?: Timestamp | Date | null;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'MY_FIREBASE_API_KEY'
  );
};

// Initialize Firebase safely
let dbInstance: ReturnType<typeof getFirestore> | null = null;

try {
  if (isFirebaseConfigured()) {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    dbInstance = getFirestore(app);
  }
} catch (error) {
  console.warn('Firebase initialization skipped or failed:', error);
}

export const db = dbInstance;

export const RANKING_COLLECTION = 'rockPaperScissorsRankings';

/**
 * Save game result to Firestore
 */
export async function saveRanking(result: {
  name: string;
  score: number;
  wins: number;
  draws: number;
  losses: number;
  time: number;
}): Promise<{ success: boolean; error?: string }> {
  if (!db) {
    console.warn('Firestore is not configured. Ranking will not be saved online.');
    return { success: false, error: 'Firebase 설정이 필요합니다. (환경변수가 지정되지 않음)' };
  }

  try {
    const rankingsRef = collection(db, RANKING_COLLECTION);
    await addDoc(rankingsRef, {
      name: result.name.trim() || '익명 학생',
      score: Number(result.score) || 0,
      wins: Number(result.wins) || 0,
      draws: Number(result.draws) || 0,
      losses: Number(result.losses) || 0,
      time: Number(result.time) || 0,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to save ranking to Firestore:', error);
    return { success: false, error: '랭킹 저장에 실패했습니다.' };
  }
}

/**
 * Fetch Top 10 rankings from Firestore sorted by score (desc) then time (asc)
 */
export async function getTopRankings(): Promise<{
  data: RankingRecord[];
  error?: string;
}> {
  if (!db) {
    return {
      data: [],
      error: 'Firebase 환경변수가 설정되지 않았습니다. .env 및 Vercel 설정을 확인해주세요.',
    };
  }

  try {
    const rankingsRef = collection(db, RANKING_COLLECTION);
    // Fetch top items sorted by score desc
    const q = query(rankingsRef, orderBy('score', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);

    const records: RankingRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        name: data.name || '익명 학생',
        score: typeof data.score === 'number' ? data.score : 0,
        wins: typeof data.wins === 'number' ? data.wins : 0,
        draws: typeof data.draws === 'number' ? data.draws : 0,
        losses: typeof data.losses === 'number' ? data.losses : 0,
        time: typeof data.time === 'number' ? data.time : 0,
        createdAt: data.createdAt,
      });
    });

    // Secondary in-memory sort by time ascending (fastest time wins on score tie)
    records.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.time - b.time;
    });

    return { data: records.slice(0, 10) };
  } catch (error) {
    console.error('Failed to fetch rankings from Firestore:', error);
    return { data: [], error: '랭킹 정보를 불러오지 못했습니다.' };
  }
}
