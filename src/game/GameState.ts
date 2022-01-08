import { Subject } from '../core';

export class GameState {
  temp: number;
  tempChanged = new Subject<number>();
  env: string;
  envChanged = new Subject<string>();

  setTemp(value) {
    this.temp = value;
    this.tempChanged.notify(value);
  }

  setEnv(value) {
    this.env = value;
    this.envChanged.notify(value);
  }
}
