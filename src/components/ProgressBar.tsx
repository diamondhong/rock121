import React from 'react';

interface ProgressBarProps {
  currentRound: number;
  totalRounds: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentRound,
  totalRounds,
}) => {
  const percentage = Math.min(
    100,
    Math.max(0, ((currentRound - 1) / totalRounds) * 100)
  );

  return (
    <div className="w-full bg-white rounded-2xl p-3 shadow-sm border border-slate-100 mb-4">
      <div className="flex justify-between items-center mb-1.5 font-bold text-slate-700 text-sm sm:text-base">
        <span className="text-emerald-700 tracking-wide font-extrabold text-base sm:text-lg">
          ROUND {currentRound} / {totalRounds}
        </span>
        <span className="text-slate-500 text-xs sm:text-sm">
          {Math.round(((currentRound) / totalRounds) * 100)}% 진행됨
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 sm:h-4 overflow-hidden p-0.5 border border-slate-200">
        <div
          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-300 ease-out shadow-inner"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
