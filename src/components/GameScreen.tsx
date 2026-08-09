import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Choice, CHOICES, RoundResultType } from '../types';
import { ProgressBar } from './ProgressBar';
import { Timer } from './Timer';

interface GameScreenProps {
  playerName: string;
  onGameComplete: (summary: {
    wins: number;
    draws: number;
    losses: number;
    totalScore: number;
    totalTimeSeconds: number;
  }) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  playerName,
  onGameComplete,
}) => {
  const TOTAL_ROUNDS = 10;

  const [round, setRound] = useState(1);
  const [wins, setWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [losses, setLosses] = useState(0);

  // Game state during round
  // 'selecting' -> 'animating' -> 'showingResult'
  const [roundState, setRoundState] = useState<'selecting' | 'animating' | 'showingResult'>('selecting');
  
  // Selection state
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [roundResult, setRoundResult] = useState<RoundResultType | null>(null);

  // Animation text state during showdown ("가위...", "바위...", "보!")
  const [animationText, setAnimationText] = useState('가위...');

  // Track elapsed time
  const gameStartTimeRef = useRef<number>(Date.now());
  const roundStartTimeRef = useRef<number>(Date.now());
  const roundTimesRef = useRef<number[]>([]);

  // Prevent double click
  const isProcessingRef = useRef(false);

  // Reset round timer timestamp whenever round changes to 'selecting'
  useEffect(() => {
    if (roundState === 'selecting') {
      roundStartTimeRef.current = Date.now();
      isProcessingRef.current = false;
      setPlayerChoice(null);
      setComputerChoice(null);
      setRoundResult(null);
    }
  }, [round, roundState]);

  // Determine winner helper
  const getResult = (p: Choice, c: Choice): RoundResultType => {
    if (p === c) return 'draw';
    if (
      (p === 'scissors' && c === 'paper') ||
      (p === 'rock' && c === 'scissors') ||
      (p === 'paper' && c === 'rock')
    ) {
      return 'win';
    }
    return 'loss';
  };

  // Get random choice for computer
  const getRandomChoice = (): Choice => {
    const choices: Choice[] = ['scissors', 'rock', 'paper'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
  };

  // Handle user selecting a choice
  const handleSelectChoice = (choice: Choice) => {
    if (roundState !== 'selecting' || isProcessingRef.current) return;
    isProcessingRef.current = true;

    const timeSpent = Math.max(1, Math.round((Date.now() - roundStartTimeRef.current) / 1000));
    roundTimesRef.current.push(timeSpent);

    setPlayerChoice(choice);
    const compChoice = getRandomChoice();
    setComputerChoice(compChoice);

    const res = getResult(choice, compChoice);
    setRoundResult(res);

    // Start battle animation sequence
    setRoundState('animating');
    runShowdownSequence(res, choice, compChoice);
  };

  // Handle timeout when time runs out (10s)
  const handleTimeout = () => {
    if (roundState !== 'selecting' || isProcessingRef.current) return;
    isProcessingRef.current = true;

    roundTimesRef.current.push(10);
    setPlayerChoice(null);
    setComputerChoice(getRandomChoice());
    setRoundResult('timeout');

    setRoundState('showingResult');
    setLosses((prev) => prev + 1);

    // Move to next round or finish after 1.8 seconds
    setTimeout(() => {
      advanceRound();
    }, 1800);
  };

  // Run '가위... 바위... 보!' animation before revealing result
  const runShowdownSequence = (
    res: RoundResultType,
    pChoice: Choice,
    cChoice: Choice
  ) => {
    setAnimationText('가위...');
    
    setTimeout(() => {
      setAnimationText('바위...');
    }, 350);

    setTimeout(() => {
      setAnimationText('보!');
    }, 700);

    setTimeout(() => {
      setRoundState('showingResult');

      // Update counters
      if (res === 'win') setWins((prev) => prev + 1);
      else if (res === 'draw') setDraws((prev) => prev + 1);
      else setLosses((prev) => prev + 1);

      // Transition to next round after 1.8 seconds
      setTimeout(() => {
        advanceRound();
      }, 1800);
    }, 1050);
  };

  // Advance to next round or complete game
  const advanceRound = () => {
    if (round >= TOTAL_ROUNDS) {
      // Calculate total time
      const totalTimeSec = Math.max(
        1,
        Math.round((Date.now() - gameStartTimeRef.current) / 1000)
      );
      
      // Calculate final stats based on updated states or current accumulators
      // We read directly from state variables + latest round result
      setWins((finalWins) => {
        setDraws((finalDraws) => {
          setLosses((finalLosses) => {
            const finalScore = finalWins * 10;
            onGameComplete({
              wins: finalWins,
              draws: finalDraws,
              losses: finalLosses,
              totalScore: finalScore,
              totalTimeSeconds: totalTimeSec,
            });
            return finalLosses;
          });
          return finalDraws;
        });
        return finalWins;
      });
    } else {
      setRound((prev) => prev + 1);
      setRoundState('selecting');
    }
  };

  const getEmojiForChoice = (c: Choice | null) => {
    if (!c) return '❓';
    if (c === 'scissors') return '✌️';
    if (c === 'rock') return '✊';
    return '✋';
  };

  const getLabelForChoice = (c: Choice | null) => {
    if (!c) return '미선택';
    if (c === 'scissors') return '가위';
    if (c === 'rock') return '바위';
    return '보';
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[85vh] px-4 py-6 max-w-xl mx-auto text-center select-none">
      {/* Top Header Section */}
      <div className="w-full">
        {/* Round Progress Bar */}
        <ProgressBar currentRound={round} totalRounds={TOTAL_ROUNDS} />

        {/* Status Bar: Live Record & Timer */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-800/10 p-3 rounded-2xl mb-4 border border-emerald-200">
          <div className="flex items-center gap-2 sm:gap-3 font-extrabold text-sm sm:text-base text-slate-800">
            <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl border border-amber-200 shadow-2xs">
              🏆 {wins}승
            </span>
            <span className="bg-sky-100 text-sky-900 px-2.5 py-1 rounded-xl border border-sky-200 shadow-2xs">
              🤝 {draws}무
            </span>
            <span className="bg-rose-100 text-rose-900 px-2.5 py-1 rounded-xl border border-rose-200 shadow-2xs">
              💥 {losses}패
            </span>
          </div>

          <Timer
            isActive={roundState === 'selecting'}
            onTimeout={handleTimeout}
          />
        </div>
      </div>

      {/* Main Battle Stage */}
      <div className="w-full bg-white rounded-3xl p-6 shadow-xl border-2 border-emerald-100 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden my-4">
        
        {/* SHOWDOWN ANIMATION PHASE */}
        {roundState === 'animating' && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-5xl sm:text-6xl font-black text-amber-500 tracking-widest my-8 animate-bounce drop-shadow"
          >
            {animationText}
          </motion.div>
        )}

        {/* SHOWING RESULT PHASE */}
        {roundState === 'showingResult' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center gap-4"
          >
            {/* Versus Cards */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 w-full">
              {/* Player Choice */}
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-2">
                  도전자 {playerName}
                </span>
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-emerald-50 rounded-3xl border-3 border-emerald-400 flex items-center justify-center text-5xl sm:text-6xl shadow-md">
                  {getEmojiForChoice(playerChoice)}
                </div>
                <span className="mt-2 font-bold text-slate-700 text-base sm:text-lg">
                  {getLabelForChoice(playerChoice)}
                </span>
              </div>

              {/* VS Banner */}
              <div className="text-2xl sm:text-3xl font-black text-amber-500 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200 shadow-2xs">
                VS
              </div>

              {/* Computer Choice */}
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-full mb-2">
                  컴퓨터 AI
                </span>
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 rounded-3xl border-3 border-slate-300 flex items-center justify-center text-5xl sm:text-6xl shadow-md">
                  {getEmojiForChoice(computerChoice)}
                </div>
                <span className="mt-2 font-bold text-slate-700 text-base sm:text-lg">
                  {getLabelForChoice(computerChoice)}
                </span>
              </div>
            </div>

            {/* Big Round Outcome Badge */}
            <motion.div
              initial={{ scale: 0.5, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="mt-4"
            >
              {roundResult === 'win' && (
                <div className="bg-emerald-500 text-white font-extrabold text-2xl sm:text-3xl px-8 py-3 rounded-2xl shadow-lg border-2 border-emerald-300 flex items-center gap-2 animate-bounce">
                  🎉 승리!
                </div>
              )}
              {roundResult === 'loss' && (
                <div className="bg-rose-500 text-white font-extrabold text-2xl sm:text-3xl px-8 py-3 rounded-2xl shadow-lg border-2 border-rose-300 flex items-center gap-2">
                  😢 패배!
                </div>
              )}
              {roundResult === 'draw' && (
                <div className="bg-sky-500 text-white font-extrabold text-2xl sm:text-3xl px-8 py-3 rounded-2xl shadow-lg border-2 border-sky-300 flex items-center gap-2">
                  🤝 무승부!
                </div>
              )}
              {roundResult === 'timeout' && (
                <div className="bg-amber-500 text-white font-extrabold text-2xl sm:text-3xl px-8 py-3 rounded-2xl shadow-lg border-2 border-amber-300 flex items-center gap-2">
                  ⏰ 시간 초과! (패배)
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* SELECTING PHASE INSTRUCTIONS */}
        {roundState === 'selecting' && (
          <div className="flex flex-col items-center justify-center my-6">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-2">
              무엇을 내시겠습니까?
            </p>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              아래 세 개의 버튼 중 하나를 누르세요!
            </p>
          </div>
        )}
      </div>

      {/* Choice Buttons (3 Big Buttons) */}
      <div className="w-full grid grid-cols-3 gap-3 sm:gap-4 my-2">
        {CHOICES.map((item) => {
          const isSelected = playerChoice === item.id;
          const isDisabled = roundState !== 'selecting';

          return (
            <motion.button
              key={item.id}
              whileHover={!isDisabled ? { scale: 1.06, y: -4 } : {}}
              whileTap={!isDisabled ? { scale: 0.94 } : {}}
              onClick={() => handleSelectChoice(item.id)}
              disabled={isDisabled}
              className={`flex flex-col items-center justify-center py-5 sm:py-6 px-2 rounded-3xl shadow-md border-3 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-100 border-amber-400 ring-4 ring-amber-200'
                  : isDisabled
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                  : 'bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-lg active:translate-y-1'
              }`}
            >
              <span className="text-4xl sm:text-5xl mb-2 select-none">
                {item.emoji}
              </span>
              <span className="font-extrabold text-lg sm:text-xl text-slate-800">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
