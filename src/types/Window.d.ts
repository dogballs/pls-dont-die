import { GameLoop } from '../core';
import { GameStore } from '../game';

declare global {
  interface Window {
    gameLoop: GameLoop;
    gameStore: GameStore;
  }
}
