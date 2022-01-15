import { Outcome, Resource, Selection } from './GameTypes';

export class SimDecider {
  static decide(selection: Selection) {
    switch (selection.creature) {
      case 'dummy':
        return this.decideDummy(selection);
    }
    throw new Error(`Unknown creature ${selection.creature}`);
  }

  static decideDummy(selection: Selection): Outcome {
    if (selection.temp === 0 && selection.env === 'none') {
      return new Outcome('alive', 'none', selection, [
        new Resource('dummium', 1),
      ]);
    }
    return new Outcome('death', 'dummy_not_neutral', selection, [
      new Resource('soulium', 1),
    ]);
  }
}
