export type GameState = 'start' | 'playing' | 'gameOver';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Operation = '+' | '-';
export type Feedback = 'idle' | 'correct' | 'incorrect';

export interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}