import type { Difficulty } from './types';

export const GAME_DURATION: Record<Difficulty, number> = {
  easy: 60,
  medium: 45,
  hard: 30,
};

export const NUMBER_RANGES: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 100,
};
