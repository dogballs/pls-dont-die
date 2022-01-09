import { SceneRouter } from '../core';

import { MainMenuScene } from './MainMenuScene';
import { LevelScene } from './LevelScene';

import { GameScene } from './GameScene';
import { GameSceneType } from './GameSceneType';

// Composition root for game scenes
export class GameSceneRouter extends SceneRouter<GameScene> {
  public constructor() {
    super();

    this.register(GameSceneType.MainMenu, MainMenuScene);
    this.register(GameSceneType.Level, LevelScene);
  }
}
