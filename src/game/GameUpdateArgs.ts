import { MouseIntersector, SpriteLoader } from '../core';
import { GameState } from './GameState';
import { GameStore } from './GameStore';

export interface GameUpdateArgs {
  deltaTime: number;
  gameState: GameState;
  gameStore: GameStore;
  mouseIntersector: MouseIntersector;
  spriteLoader: SpriteLoader;
}
