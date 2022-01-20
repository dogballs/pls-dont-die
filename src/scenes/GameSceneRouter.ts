import { SceneRouter } from '../core';

import { IntroScene } from './IntroScene';
import { LevelScene } from './LevelScene';
import { MainMenuScene } from './MainMenuScene';

import { GameScene } from './GameScene';
import { GameSceneType } from './GameSceneType';

// Composition root for game scenes
export class GameSceneRouter extends SceneRouter<GameScene> {
  public constructor() {
    super();

    this.register(GameSceneType.Intro, IntroScene);
    this.register(GameSceneType.Level, LevelScene);
    this.register(GameSceneType.MainMenu, MainMenuScene);
  }
}
