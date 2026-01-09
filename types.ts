export type GameState = 'MENU' | 'SETUP' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export enum BugType {
  LADYBUG = 'LADYBUG',
  SPIDER = 'SPIDER',
  FLY = 'FLY',
  BEE = 'BEE',
  CATERPILLAR = 'CATERPILLAR',
  BLACK_ANT = 'BLACK_ANT',
  RED_ANT = 'RED_ANT',
  DRAGONFLY = 'DRAGONFLY',
  LOCUST = 'LOCUST',
  // Special type for empty holes or visual effects
  NONE = 'NONE'
}

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface BugEntity {
  id: number;
  type: BugType;
  visible: boolean;
}

export interface ScoreConfig {
  points: number;
  speed: number; // Duration in ms the bug stays visible
}