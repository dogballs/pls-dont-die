import { GameObject, SpritePainter, Rect } from '../core';
import { GameUpdateArgs } from '../game';

import { CageTemp } from './CageTemp';

export class Cage extends GameObject {
  painter = new SpritePainter();

  private temp: CageTemp;

  constructor() {
    super(512, 512);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    this.painter.sprite = spriteLoader.load('cage', new Rect(0, 0, 512, 512));

    this.temp = new CageTemp();
    this.add(this.temp);
  }
}
