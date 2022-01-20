import { config } from '../config';

import { Outcome, Resource, Selection } from './GameTypes';

export class SimDecider {
  static decide(selection: Selection) {
    let outcome: Outcome;
    switch (selection.creature) {
      case 'dummy':
        outcome = this.decideDummy(selection);
        break;
      case 'dummyfish':
        outcome = this.decideDummyfish(selection);
        break;
      case 'scorporate':
        outcome = this.decideScorporate(selection);
        break;
      case 'fishy':
        outcome = this.decideFishy(selection);
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

  static decideDummyfish(selection: Selection): Outcome {
    if (selection.env !== 'underwater') {
      return new Outcome('death', 'dehydration', selection, [
        new Resource({ type: 'techium', amount: 1 }),
      ]);
    }
    if (selection.temp > -20) {
      return new Outcome('death', 'overheat', selection, [
        new Resource({ type: 'liquium', amount: 1 }),
      ]);
    }
    return new Outcome('alive', 'none', selection, [
      new Resource({ type: 'fishium', amount: 1 }),
    ]);
  }

  static decideScorporate(selection: Selection): Outcome {
    if (selection.env === 'none') {
      return new Outcome('death', 'discomfort', selection, [
        new Resource({ type: 'sandium', amount: 1 }),
      ]);
    }
    if (selection.env === 'underwater') {
      return new Outcome('death', 'drowning', selection, [
        new Resource({ type: 'techium', amount: 1 }),
      ]);
    }
    if (selection.temp < 20) {
      return new Outcome('death', 'hypothermia', selection, [
        new Resource({ type: 'sandium', amount: 1 }),
      ]);
    }
    return new Outcome('alive', 'none', selection, [
      new Resource({ type: 'arachium', amount: 1 }),
    ]);
  }

  static decideFishy(selection: Selection): Outcome {
    if (selection.env !== 'underwater') {
      return new Outcome('death', 'dehydration', selection, [
        new Resource({ type: 'liquium', amount: 1 }),
      ]);
    }
    if (selection.temp > -20) {
      return new Outcome('death', 'overheat', selection, [
        new Resource({ type: 'liquium', amount: 1 }),
      ]);
    }
    return new Outcome('alive', 'none', selection, [
      new Resource({ type: 'fishium', amount: 1 }),
    ]);
  }
}
