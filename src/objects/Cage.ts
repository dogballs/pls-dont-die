import { GameObject, SpritePainter, Rect } from '../core';
import { GameUpdateArgs } from '../game';

export class Cage extends GameObject {
  public painter = new SpritePainter();

  constructor() {
    super(512, 512);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    this.painter.sprite = spriteLoader.load('cage', new Rect(0, 0, 512, 512));
  }
}
