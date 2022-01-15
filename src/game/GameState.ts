import { Subject } from '../core';

import { CreatureType, EnvType } from './GameTypes';

export class GameState {
  creature: CreatureType;
  creatureChanged = new Subject<CreatureType>();
  temp: number;
  tempChanged = new Subject<number>();
  env: EnvType;
  envChanged = new Subject<EnvType>();

  setCreature(value) {
    this.creature = value;
    this.creatureChanged.notify(value);
  }

  setTemp(value) {
    this.temp = value;
    this.tempChanged.notify(value);
  }

  setEnv(value) {
    this.env = value;
    this.envChanged.notify(value);
  }

  resetSelection() {
    this.creature = undefined;
    this.temp = undefined;
    this.env = undefined;
  }
}
