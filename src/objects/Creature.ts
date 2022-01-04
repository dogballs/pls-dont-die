import { GameObject, SpritePainter } from '../core';

export class Creature extends GameObject {
  public painter = new SpritePainter();

  constructor() {
    super(200, 200);
  }

  protected setup({ spriteLoader }) {
    this.painter.sprite = spriteLoader.load('borpa');
  }
}
