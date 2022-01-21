import { config } from '../config';

import {
  DeathType,
  Outcome,
  Resource,
  ResourceType,
  Selection,
} from './GameTypes';

type Triple = [boolean, DeathType, ResourceType];

export class SimDecider {
  static decide(selection: Selection) {
    let conditions: Triple[];

    switch (selection.creature) {
      case 'dummy':
        conditions = this.decideDummy(selection);
        break;
      case 'dummyfish':
        conditions = this.decideDummyfish(selection);
        break;
      case 'scorporate':
        conditions = this.decideScorporate(selection);
        break;
      case 'fishy':
        conditions = this.decideFishy(selection);
        break;
      case 'wasp':
        conditions = this.decideWasp(selection);
        break;
      case 'spirit':
        conditions = this.decideSpirit();
        break;
      default:
        throw new Error(`Unknown creature ${selection.creature}`);
    }

    let outcome: Outcome;

    // Can be multiple truthy?
    for (const [truthy, deathType, resourceType] of conditions) {
      if (truthy) {
        outcome = new Outcome(
          deathType === 'none' ? 'alive' : 'death',
          deathType,
          selection,
          [new Resource({ type: resourceType, amount: 1 })],
        );
        break;
      }
    }

    if (!outcome) {
      throw new Error(`No outcome for "${selection.creature}"`);
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

  static decideDummy({ env, temp }: Selection): Triple[] {
    // TODO: do I drop only one modifier here? or all 3?
    // liquim is realistic - water from mechs
    return [
      [temp > 0, 'overheat', 'techium'],
      [temp < 0, 'hypothermia', 'techium'],
      [env === 'underwater', 'short_circuit', 'liquium'],
      [env === 'desert', 'stuck_mech', 'sandium'],
      [env === 'air', 'gravity', 'techium'],
      [true, 'none', 'dummium'],
    ];
  }

  static decideDummyfish({ env, temp }: Selection): Triple[] {
    return [
      [env !== 'underwater', 'dehydration', 'techium'],
      [temp > -20, 'overheat', 'liquium'],
      [true, 'none', 'fishium'],
    ];
  }

  static decideScorporate({ env, temp }: Selection): Triple[] {
    return [
      [env === 'none', 'discomfort', 'sandium'],
      [env === 'underwater', 'drowning', 'techium'],
      [env === 'air', 'gravity', 'techium'],
      [temp < 20, 'hypothermia', 'sandium'],
      [true, 'none', 'arachium'],
    ];
  }

  static decideFishy({ env, temp }: Selection): Triple[] {
    return [
      [env !== 'underwater', 'dehydration', 'liquium'],
      [temp > -20, 'overheat', 'liquium'],
      [true, 'none', 'fishium'],
    ];
  }

  static decideWasp({ env, temp }: Selection): Triple[] {
    return [
      [env === 'none', 'discomfort', 'sandium'],
      [env === 'underwater', 'drowning', 'sandium'],
      [env === 'desert', 'drowning', 'windium'],
      [temp > 20, 'overheat', 'sandium'],
      [temp < 0, 'hypothermia', 'windium'],
      [true, 'none', 'arachium'],
    ];
  }

  static decideSpirit(): Triple[] {
    return [[true, 'curse', 'soulium']];
  }
}
