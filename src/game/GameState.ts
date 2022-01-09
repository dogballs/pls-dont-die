import { Subject } from '../core';

export class GameState {
  creature: string;
  creatureChanged = new Subject<string>();
  temp: number;
  tempChanged = new Subject<number>();
  env: string;
  envChanged = new Subject<string>();

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
}
