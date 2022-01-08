import { GameObject } from '../core';
import { GameUpdateArgs } from '../game';

import { EnvSelector } from './EnvSelector';
import { LightSelector } from './LightSelector';
import { TempSelector } from './TempSelector';

export class ControlPanel extends GameObject {
  constructor() {
    super(256, 512);
  }

  protected setup({ gameState }: GameUpdateArgs) {
    const envSelector = new EnvSelector();
    this.add(envSelector);

    const tempSelector = new TempSelector();
    tempSelector.position.set(0, 96);
    tempSelector.changed.addListener((value) => {
      gameState.setTemp(value);
    });
    this.add(tempSelector);

    const lightSelector = new LightSelector();
    lightSelector.position.set(0, 194);
    this.add(lightSelector);
  }
}
