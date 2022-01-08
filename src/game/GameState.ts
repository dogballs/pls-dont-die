import { Subject } from '../core';

export class GameState {
  temp: number;
  tempChange = new Subject<number>();

  setTemp(value) {
    this.temp = value;
    this.tempChange.notify(value);
  }
}
