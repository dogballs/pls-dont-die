import { GameObject, SpritePainter } from '../core';

export class Creature extends GameObject {
  painter = new SpritePainter();
  zIndex = 2;

  constructor() {
    super(200, 200);
  }

  protected setup({ spriteLoader }) {
    this.painter.sprite = spriteLoader.load('borpa');
  }
}
