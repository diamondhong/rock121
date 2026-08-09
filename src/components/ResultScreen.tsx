import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Home, Star, Timer, Award } from 'lucide-react';
import { saveRanking } from '../firebase';

interface ResultScreenProps {
  playerName: string;
  wins: number;
  draws: number;
  losses: number;
  totalScore: number;
  totalTimeSeconds: number;
  onRestart: () => void;
  onHome: () => void;
  onViewRanking: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  playerName,
  wins,
  draws,
  losses,
  totalScore,
  totalTimeSeconds,
  onRestart,
  onHome,
  onViewRanking,
}) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Guard against duplicate saves in StrictMode
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    async function performSave() {
      setSaveStatus('saving');
      const res = await saveRanking({
        name: playerName,
        score: totalScore,
        wins,
        draws,
        losses,
        time: totalTimeSeconds,
      });

      if (res.success) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
        setErrorMessage(res.error || '랭킹 저장에 실패했습니다.');
      }
    }

    performSave();
  }, [playerName, totalScore, wins, draws, losses, totalTimeSeconds]);

  // Determine feedback message based on wins
  const getResultMessage = () => {
    if (wins >= 9) {
      return {
        title: '👑 가위바위보의 신!',
        sub: '엄청난 실력이에요! 적수가 없군요!',
        color: 'bg-amber-100 text-amber-900 border-amber-300',
      };
    }
    if (wins >= 7) {
      return {
        title: '🏆 가위바위보 고수!',
        sub: '대단해요! 최고의 가위바위보 실력가!',
        color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      };
    }
    if (wins >= 5) {
      return {
        title: '👏 멋진 승부였어요!',
        sub: '좋은 결과를 얻었어요! 조금만 더 하면 상위권!',
        color: 'bg-sky-100 text-sky-900 border-sky-300',
      };
    }
    return {
      title: '🔥 다시 한번 도전해 보세요!',
      sub: '포기하지 마세요! 연습하면 더욱 잘할 수 있어요!',
      color: 'bg-rose-100 text-rose-900 border-rose-300',
    };
  };

  const message = getResultMessage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 max-w-lg mx-auto text-center">
      {/* Title */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-4"
      >
        <span className="text-4xl sm:text-5xl font-black text-emerald-800 tracking-tight">
          🎉 게임 종료!
        </span>
      </motion.div>

      {/* Player Name Tag */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-emerald-500 text-white font-extrabold text-2xl sm:text-3xl px-6 py-2 rounded-2xl shadow-md mb-6 border-2 border-emerald-400 inline-block"
      >
        {playerName}
      </motion.div>

      {/* Result Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full bg-white rounded-3xl p-6 shadow-xl border-2 border-emerald-100 mb-6"
      >
        {/* Custom Message Banner */}
        <div className={`p-4 rounded-2xl border-2 mb-6 ${message.color}`}>
          <p className="text-2xl font-black mb-1">{message.title}</p>
          <p className="text-sm sm:text-base font-bold opacity-90">{message.sub}</p>
        </div>

        {/* Score & Time Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex flex-col items-center justify-center">
            <span className="text-xs sm:text-sm font-bold text-amber-800 flex items-center gap-1 mb-1">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              최종 점수
            </span>
            <span className="text-3xl sm:text-4xl font-black text-amber-600">
              ⭐ {totalScore}점
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
            <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1 mb-1">
              <Timer className="w-4 h-4 text-slate-600" />
              전체 소요시간
            </span>
            <span className="text-3xl sm:text-4xl font-black text-slate-800">
              ⏱ {totalTimeSeconds}초
            </span>
          </div>
        </div>

        {/* Detailed Round Stats */}
        <div className="flex justify-around items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-800 font-extrabold text-base sm:text-lg">
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 font-bold mb-1">승리</span>
            <span className="text-emerald-600 text-xl sm:text-2xl">🏆 {wins}승</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 font-bold mb-1">무승부</span>
            <span className="text-sky-600 text-xl sm:text-2xl">🤝 {draws}무</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 font-bold mb-1">패배</span>
            <span className="text-rose-600 text-xl sm:text-2xl">💥 {losses}패</span>
          </div>
        </div>

        {/* Save Status Notice */}
        <div className="mt-4 text-xs sm:text-sm font-bold">
          {saveStatus === 'saving' && (
            <p className="text-sky-600 animate-pulse">⏳ 랭킹에 기록을 저장하는 중...</p>
          )}
          {saveStatus === 'saved' && (
            <p className="text-emerald-600">✅ 랭킹에 성공적으로 기록되었습니다!</p>
          )}
          {saveStatus === 'error' && (
            <p className="text-rose-500">⚠️ {errorMessage}</p>
          )}
        </div>
      </motion.div>

      {/* Buttons */}
      <div className="w-full flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-lg sm:text-xl py-3.5 rounded-2xl shadow-md border-b-4 border-emerald-700 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>🔄 다시 도전하기</span>
        </motion.button>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewRanking}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-base py-3 rounded-2xl shadow-sm border border-amber-300 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>🏆 랭킹 보기</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onHome}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-base py-3 rounded-2xl shadow-sm border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>🏠 처음으로</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
