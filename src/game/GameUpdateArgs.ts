import { MouseInput, SpriteLoader } from '../core';

export interface GameUpdateArgs {
  deltaTime: number;
  mouseInput: MouseInput;
  spriteLoader: SpriteLoader;
}
