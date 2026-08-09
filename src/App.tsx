import React, { useState } from 'react';
import { ScreenMode } from './types';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { RankingScreen } from './components/RankingScreen';

export default function App() {
  const [screenMode, setScreenMode] = useState<ScreenMode>('start');
  const [playerName, setPlayerName] = useState('');

  const [lastGameSummary, setLastGameSummary] = useState<{
    wins: number;
    draws: number;
    losses: number;
    totalScore: number;
    totalTimeSeconds: number;
  } | null>(null);

  const handleStartGame = () => {
    setScreenMode('game');
  };

  const handleGameComplete = (summary: {
    wins: number;
    draws: number;
    losses: number;
    totalScore: number;
    totalTimeSeconds: number;
  }) => {
    setLastGameSummary(summary);
    setScreenMode('result');
  };

  const handleRestart = () => {
    setScreenMode('game');
  };

  const handleHome = () => {
    setScreenMode('start');
  };

  const handleViewRanking = () => {
    setScreenMode('ranking');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-green-100 font-sans text-slate-800 antialiased selection:bg-emerald-200">
      <main className="container mx-auto py-4">
        {screenMode === 'start' && (
          <StartScreen
            playerName={playerName}
            onPlayerNameChange={setPlayerName}
            onStartGame={handleStartGame}
            onViewRanking={handleViewRanking}
          />
        )}

        {screenMode === 'game' && (
          <GameScreen
            playerName={playerName}
            onGameComplete={handleGameComplete}
          />
        )}

        {screenMode === 'result' && lastGameSummary && (
          <ResultScreen
            playerName={playerName}
            wins={lastGameSummary.wins}
            draws={lastGameSummary.draws}
            losses={lastGameSummary.losses}
            totalScore={lastGameSummary.totalScore}
            totalTimeSeconds={lastGameSummary.totalTimeSeconds}
            onRestart={handleRestart}
            onHome={handleHome}
            onViewRanking={handleViewRanking}
          />
        )}

        {screenMode === 'ranking' && (
          <RankingScreen
            currentPlayerName={playerName}
            onRestart={handleRestart}
            onHome={handleHome}
          />
        )}
      </main>
    </div>
  );
}
