import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Home, RefreshCw, AlertCircle } from 'lucide-react';
import { getTopRankings, RankingRecord } from '../firebase';

interface RankingScreenProps {
  currentPlayerName: string;
  onRestart: () => void;
  onHome: () => void;
}

export const RankingScreen: React.FC<RankingScreenProps> = ({
  currentPlayerName,
  onRestart,
  onHome,
}) => {
  const [rankings, setRankings] = useState<RankingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchRankings = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await getTopRankings();
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setRankings(res.data);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  const getRankBadge = (index: number) => {
    if (index === 0) return <span className="text-2xl">🥇</span>;
    if (index === 1) return <span className="text-2xl">🥈</span>;
    if (index === 2) return <span className="text-2xl">🥉</span>;
    return <span className="text-sm font-black text-slate-500 w-6 text-center">{index + 1}위</span>;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 max-w-lg mx-auto text-center">
      {/* Title */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 mb-2"
      >
        <Trophy className="w-8 h-8 text-amber-500 fill-amber-400" />
        <h1 className="text-3xl sm:text-4xl font-black text-emerald-900 tracking-tight">
          🏆 가위바위보 챔피언 TOP 10
        </h1>
      </motion.div>

      <p className="text-sm text-slate-600 mb-6 font-medium">
        최고 점수 순, 점수가 같으면 최단 소요시간 순으로 정렬됩니다!
      </p>

      {/* Main Ranking Card */}
      <div className="w-full bg-white rounded-3xl p-5 shadow-xl border-2 border-emerald-100 mb-6 min-h-[320px] flex flex-col justify-between">
        
        {loading && (
          <div className="flex flex-col items-center justify-center my-auto py-12 gap-3 text-emerald-600 font-bold">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <span>랭킹 불러오는 중...</span>
          </div>
        )}

        {!loading && errorMsg && (
          <div className="flex flex-col items-center justify-center my-auto py-8 text-slate-700">
            <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
            <p className="font-bold text-rose-600 mb-2">{errorMsg}</p>
            <p className="text-xs text-slate-500 mb-4 max-w-xs">
              Firebase 설정 정보를 확인해 주세요. 로컬이나 Vercel의 환경변수에 VITE_FIREBASE_* 설정이 필요합니다.
            </p>
            <button
              onClick={fetchRankings}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              다시 시도
            </button>
          </div>
        )}

        {!loading && !errorMsg && rankings.length === 0 && (
          <div className="flex flex-col items-center justify-center my-auto py-12 text-slate-500 font-bold">
            <span className="text-4xl mb-2">🎈</span>
            <p>아직 등록된 랭킹이 없어요!</p>
            <p className="text-xs text-slate-400 font-normal mt-1">
              지금 게임을 플레이해서 첫 번째 🏆 챔피언이 되어 보세요!
            </p>
          </div>
        )}

        {!loading && !errorMsg && rankings.length > 0 && (
          <div className="flex flex-col gap-2.5 my-2">
            {rankings.map((item, index) => {
              const isCurrentPlayer =
                currentPlayerName &&
                item.name.trim().toLowerCase() === currentPlayerName.trim().toLowerCase();

              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    isCurrentPlayer
                      ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300 shadow-md font-extrabold'
                      : index === 0
                      ? 'bg-amber-50/80 border-amber-200'
                      : index === 1
                      ? 'bg-slate-50/80 border-slate-200'
                      : index === 2
                      ? 'bg-amber-900/5 border-amber-800/10'
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  {/* Left: Badge & Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex justify-center items-center">
                      {getRankBadge(index)}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-base text-slate-800 truncate max-w-[120px] sm:max-w-[150px]">
                          {item.name}
                        </span>
                        {isCurrentPlayer && (
                          <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded-md">
                            나
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {item.wins}승 {item.draws}무 {item.losses}패
                      </span>
                    </div>
                  </div>

                  {/* Right: Score & Time */}
                  <div className="text-right flex flex-col items-end">
                    <span className="text-lg font-black text-emerald-700">
                      {item.score}점
                    </span>
                    <span className="text-xs text-slate-500 font-bold bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                      ⏱ {item.time}초
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="w-full grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base py-3.5 rounded-2xl shadow-md border-b-4 border-emerald-700 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>🔄 다시 도전하기</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onHome}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-base py-3.5 rounded-2xl shadow-sm border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span>🏠 처음으로</span>
        </motion.button>
      </div>
    </div>
  );
};
