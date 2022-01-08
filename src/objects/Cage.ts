import { GameObject, SpritePainter, Rect } from '../core';
import { GameUpdateArgs } from '../game';

import { CageEnv } from './CageEnv';
import { CageTemp } from './CageTemp';

export class Cage extends GameObject {
  painter = new SpritePainter();

  constructor() {
    super(512, 512);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    this.painter.sprite = spriteLoader.load('cage', new Rect(0, 0, 512, 512));

    const env = new CageEnv();
    this.add(env);

    const temp = new CageTemp();
    this.add(temp);
  }
}
