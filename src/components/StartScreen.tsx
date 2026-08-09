import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Play, User, Sparkles } from 'lucide-react';

interface StartScreenProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onStartGame: () => void;
  onViewRanking: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  playerName,
  onPlayerNameChange,
  onStartGame,
  onViewRanking,
}) => {
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setErrorMsg('이름이나 닉네임을 꼭 입력해 주세요! 😊');
      return;
    }
    setErrorMsg('');
    onStartGame();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 max-w-lg mx-auto text-center">
      {/* Decorative Title Badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        className="bg-amber-100 text-amber-800 font-bold px-4 py-1.5 rounded-full text-sm sm:text-base mb-4 flex items-center gap-1.5 shadow-sm border border-amber-200"
      >
        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
        <span>초등학생 우수 추천 웹게임</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-4xl sm:text-5xl font-extrabold text-emerald-800 tracking-wider mb-3 leading-tight drop-shadow-sm"
      >
        ✌️ 가위바위보 대결 ✊
      </motion.h1>

      <motion.p
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-base sm:text-lg text-emerald-700 font-medium mb-8 bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100"
      >
        "컴퓨터와 10번 대결하고 최고의 기록에 도전하세요!"
      </motion.p>

      {/* Choice Preview Display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex justify-center gap-4 mb-8"
      >
        {['✌️', '✊', '✋'].map((emoji, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-3xl shadow-md border-2 border-emerald-200 flex items-center justify-center text-4xl sm:text-5xl cursor-default select-none transform transition-transform"
          >
            {emoji}
          </motion.div>
        ))}
      </motion.div>

      {/* Name Input Form */}
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        onSubmit={handleStart}
        className="w-full bg-white p-6 rounded-3xl shadow-lg border-2 border-emerald-100 mb-6"
      >
        <label className="block text-left text-slate-700 font-bold mb-2 text-sm sm:text-base flex items-center gap-1.5">
          <User className="w-5 h-5 text-emerald-600" />
          <span>도전자 이름</span>
        </label>
        
        <input
          type="text"
          value={playerName}
          onChange={(e) => {
            onPlayerNameChange(e.target.value);
            if (e.target.value.trim()) setErrorMsg('');
          }}
          placeholder="이름 또는 닉네임을 입력하세요"
          maxLength={20}
          className="w-full px-4 py-3.5 text-lg rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all mb-2 text-center font-bold text-slate-800 placeholder-slate-400"
        />

        {errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm font-bold mb-3"
          >
            {errorMsg}
          </motion.p>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xl py-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>▶ 게임 시작</span>
        </motion.button>
      </motion.form>

      {/* Leaderboard Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onViewRanking}
        className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-base sm:text-lg px-6 py-3 rounded-2xl shadow-sm border-2 border-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <Trophy className="w-5 h-5 text-amber-900" />
        <span>🏆 전체 랭킹 보기</span>
      </motion.button>
    </div>
  );
};
