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
      case 'drone':
        conditions = this.decideDrone(selection);
        break;
      case 'bat':
        conditions = this.decideBat(selection);
        break;
      case 'eaglefish':
        conditions = this.decideEaglefish(selection);
        break;
      case 'dragon':
        conditions = this.decideDragon(selection);
        break;
      case 'spirit':
        conditions = this.decideSpirit();
        break;
      case 'fishsteak':
        conditions = this.decideFishsteak(selection);
        break;
      case 'lighter':
        conditions = this.decideLighter(selection);
        break;
      case 'firebug':
        conditions = this.decideFirebug(selection);
        break;
      case 'snake':
        conditions = this.decideSnake(selection);
        break;
      case 'firesnail':
        conditions = this.decideFiresnail(selection);
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
      [env === 'desert', 'drought', 'sandium'],
      [temp > 20, 'overheat', 'windium'],
      [temp < 0, 'hypothermia', 'windium'],
      [true, 'none', 'arachium'],
    ];
  }

  static decideDrone({ env, temp }: Selection): Triple[] {
    return [
      [env === 'underwater', 'short_circuit', 'techium'],
      [env === 'desert', 'stuck_mech', 'techium'],
      [env === 'none', 'boredom', 'techium'],
      [temp > 10, 'overheat', 'windium'],
      [temp < -10, 'hypothermia', 'windium'],
      [true, 'none', 'dummium'],
    ];
  }

  static decideBat({ env }: Selection): Triple[] {
    return [
      [env === 'underwater', 'drowning', 'sandium'],
      [env === 'desert', 'drought', 'sandium'],
      [env === 'none', 'thirst', 'windium'],
      [true, 'none', 'arachium'],
    ];
  }

  static decideEaglefish({ env }: Selection): Triple[] {
    return [
      [env === 'none', 'confusion', 'windium'],
      [env === 'underwater', 'viceversa', 'liquium'],
      [env === 'desert', 'drought', 'windium'],
      [true, 'none', 'fishium'],
    ];
  }

  static decideFishsteak({ env, temp }: Selection): Triple[] {
    return [
      [env !== 'none', 'why', 'sandium'],
      [temp < 20, 'ramsay', 'sandium'],
      [true, 'none', 'fishium'],
    ];
  }

  static decideDragon({ env, temp }: Selection): Triple[] {
    return [
      [env === 'none', 'discomfort', 'windium'],
      [env === 'underwater', 'drowning', 'windium'],
      [temp < 20, 'hypothermia', 'flamium'],
      [true, 'none', 'reptilium'],
    ];
  }

  static decideLighter({ env, temp }: Selection): Triple[] {
    return [
      [env === 'underwater', 'short_circuit', 'techium'],
      [env === 'desert', 'stuck_mech', 'techium'],
      [env === 'air', 'gravity', 'techium'],
      [temp > 10, 'overheat', 'flamium'],
      [temp < -10, 'hypothermia', 'flamium'],
      [true, 'none', 'dummium'],
    ];
  }

  static decideFirebug({ env, temp }: Selection): Triple[] {
    return [
      [env === 'underwater', 'drowning', 'sandium'],
      [env === 'air', 'gravity', 'flamium'],
      [env === 'none', 'discomfort', 'flamium'],
      [temp < -10, 'hypothermia', 'sandium'],
      [true, 'none', 'arachium'],
    ];
  }

  static decideSnake({ env, temp }: Selection): Triple[] {
    return [
      [env === 'air', 'gravity', 'sandium'],
      [env === 'none', 'discomfort', 'sandium'],
      [temp < 10, 'hypothermia', 'liquium'],
      [true, 'none', 'reptilium'],
    ];
  }

  static decideFiresnail({ env, temp }: Selection): Triple[] {
    return [
      [env !== 'underwater', 'burned', 'flamium'],
      [temp > -20, 'burned', 'flamium'],
      [true, 'none', 'reptilium'],
    ];
  }

  static decideSpirit(): Triple[] {
    // TODO: ok when all collected?
    return [[true, 'curse', 'soulium']];
  }
}
