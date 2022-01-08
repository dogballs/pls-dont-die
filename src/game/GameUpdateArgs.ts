import { MouseIntersector, SpriteLoader } from '../core';
import { GameState } from './GameState';

export interface GameUpdateArgs {
  deltaTime: number;
  gameState: GameState;
  mouseIntersector: MouseIntersector;
  spriteLoader: SpriteLoader;
}
