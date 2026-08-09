export type Choice = 'scissors' | 'rock' | 'paper';

export interface ChoiceOption {
  id: Choice;
  label: string;
  emoji: string;
}

export type RoundResultType = 'win' | 'draw' | 'loss' | 'timeout';

export interface RoundResult {
  round: number;
  playerChoice: Choice | null;
  computerChoice: Choice | null;
  result: RoundResultType;
  scoreGained: number;
  timeTaken: number;
}

export type ScreenMode = 'start' | 'game' | 'result' | 'ranking';

export interface GameSummary {
  playerName: string;
  wins: number;
  draws: number;
  losses: number;
  totalScore: number;
  totalTimeSeconds: number;
}

export const CHOICES: ChoiceOption[] = [
  { id: 'scissors', label: '가위', emoji: '✌️' },
  { id: 'rock', label: '바위', emoji: '✊' },
  { id: 'paper', label: '보', emoji: '✋' },
];
