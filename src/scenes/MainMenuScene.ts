import {
  GameObject,
  MouseCode,
  SpritePainter,
  TextAlignment,
  TextPainter,
} from '../core';
import { GameUpdateArgs } from '../game';

import { GameSceneType } from './GameSceneType';
import { GameScene } from './GameScene';

export class MainMenuScene extends GameScene {
  private title: GameObject;
  private newGame: GameObject;

  protected setup({ mouseIntersector, spriteLoader }: GameUpdateArgs) {
    this.title = new GameObject(512, 128);
    this.title.position.set(256, 64);
    this.title.painter = new SpritePainter(spriteLoader.load('main.title.1'));
    this.root.add(this.title);

    this.newGame = new GameObject(256, 48);
    this.newGame.painter = new TextPainter({
      text: 'NEW GAME',
      color: '#fff',
      size: 36,
      alignment: TextAlignment.MiddleCenter,
    });
    this.newGame.position.set(384, 256);

    mouseIntersector.listenEnter(this.newGame);

    this.root.add(this.newGame);
  }

  protected update(updateArgs: GameUpdateArgs) {
    const { mouseIntersector } = updateArgs;

    if (mouseIntersector.isEnterAt(this.newGame)) {
      (this.newGame.painter as TextPainter).setOptions({ color: '#e9e6ab' });
    }
    if (mouseIntersector.isLeaveAt(this.newGame)) {
      (this.newGame.painter as TextPainter).setOptions({ color: '#fff' });
    }
    if (mouseIntersector.isDownAt(MouseCode.LeftClick, this.newGame)) {
      this.navigator.push(GameSceneType.Level);
    }

    super.update(updateArgs);
  }
}
