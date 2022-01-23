import { GameObject, SpritePainter, TextPainter } from '../core';
import { GameUpdateArgs } from '../game';
import { config } from '../config';

export class MainMenuOverlay extends GameObject {
  constructor() {
    super(config.CANVAS_WIDTH, config.CANVAS_HEIGHT);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    const title = new GameObject(512, 128);
    title.position.set(256, 64);
    title.painter = new SpritePainter(spriteLoader.load('main.title.1'));
    this.add(title);

    const version = new GameObject(128, 32);
    version.painter = new TextPainter({
      text: `Version ${config.VERSION}`,
      color: '#999',
      alignment: TextPainter.Alignment.MiddleCenter,
      size: 14,
    });
    version.position.set(870, 720);
    this.add(version);
  }
}
