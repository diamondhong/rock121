import React, { useEffect, useState } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  initialSeconds?: number;
  isActive: boolean;
  onTimeout: () => void;
  onTick?: (secondsLeft: number) => void;
}

export const Timer: React.FC<TimerProps> = ({
  initialSeconds = 10,
  isActive,
  onTimeout,
  onTick,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds, isActive]);

  useEffect(() => {
    if (!isActive) return;

    if (secondsLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (onTick) onTick(next);
        if (next <= 0) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, secondsLeft, onTimeout, onTick]);

  const isWarning = secondsLeft <= 5 && secondsLeft > 0;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xl transition-all shadow-sm ${
        isWarning
          ? 'bg-rose-100 text-rose-600 border-2 border-rose-300 animate-urgent scale-105'
          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
      }`}
    >
      <TimerIcon className={`w-6 h-6 ${isWarning ? 'text-rose-600 animate-spin' : 'text-emerald-700'}`} />
      <span>⏱ {secondsLeft}초</span>
    </div>
  );
};
