import { config } from '../config';

import { Outcome, Resource, Selection } from './GameTypes';

export class SimDecider {
  static decide(selection: Selection) {
    let outcome: Outcome;
    switch (selection.creature) {
      case 'dummy':
        outcome = this.decideDummy(selection);
        break;
      case 'fish':
        outcome = this.decideFish(selection);
        break;
      default:
        throw new Error(`Unknown creature ${selection.creature}`);
    }

    for (const resource of outcome.resources) {
      const creatureConfig = config.CREATURES[selection.creature];
      const isDroppable = creatureConfig.droppedResources.some((dropRes) => {
        return resource.type === dropRes.type;
      });
      if (!isDroppable) {
        throw new Error(
          `Resource "${resource.type}" not droppable for "${selection.creature}"`,
        );
      }
    }

    return outcome;
  }

  static decideDummy(selection: Selection): Outcome {
    if (selection.temp > 0) {
      return new Outcome('death', 'overheat', selection, [
        new Resource({ type: 'techium', amount: 1 }),
      ]);
    }
    if (selection.temp < 0) {
      return new Outcome('death', 'hypothermia', selection, [
        new Resource({ type: 'techium', amount: 1 }),
      ]);
    }
    if (selection.env === 'none') {
      return new Outcome('alive', 'none', selection, [
        new Resource({ type: 'dummium', amount: 1 }),
      ]);
    }
    if (selection.env === 'underwater') {
      return new Outcome('death', 'short_circuit', selection, [
        new Resource({ type: 'liquium', amount: 1 }),
      ]);
    }
    if (selection.env === 'desert') {
      return new Outcome('death', 'stuck_mech', selection, [
        new Resource({ type: 'sandium', amount: 1 }),
      ]);
    }
    throw new Error(`Unexpected conditions for dummy`);
  }

  static decideFish(selection: Selection): Outcome {
    if (selection.temp > 20 && selection.env === 'underwater') {
      return new Outcome('alive', 'none', selection, [
        new Resource({ type: 'fishium', amount: 1 }),
      ]);
    }
    if (selection.env !== 'underwater') {
      return new Outcome('death', 'dehydration', selection, [
        new Resource({ type: 'soulium', amount: 1 }),
      ]);
    }
    return new Outcome('death', 'hypothermia', selection, [
      new Resource({ type: 'soulium', amount: 1 }),
    ]);
  }
}
