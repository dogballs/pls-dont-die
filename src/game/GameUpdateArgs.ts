import { MouseIntersector, SpriteLoader } from '../core';

export interface GameUpdateArgs {
  deltaTime: number;
  mouseIntersector: MouseIntersector;
  spriteLoader: SpriteLoader;
}
