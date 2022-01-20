import { config } from '../config';

import { Creature, CreatureType, Resource, ResourceType } from './GameTypes';

export class SummonHelper {
  static decideCreature(
    essence: ResourceType,
    modifier: ResourceType,
  ): CreatureType {
    for (const creatureType of Object.keys(config.CREATURES)) {
      const creatureConfig = config.CREATURES[creatureType];
      const creature = Creature.fromConfig(creatureConfig);

      for (const reqs of creature.requiredResourceGroups) {
        if (reqs.length !== 2) {
          throw new Error(`Creature "${creatureType}" has non 2 required res`);
        }

        if (
          (reqs[0].type === essence && reqs[1].type === modifier) ||
          (reqs[0].type === modifier && reqs[1].type === essence)
        ) {
          return creature.type;
        }
      }
    }

    throw new Error(`Unknown combination: es = ${essence}, mod = ${modifier}`);
  }

  // static canSummon(
  //   creatureType: CreatureType,
  //   currentResources: Resource[],
  // ): boolean {
  //   const creatureConfig = config.CREATURES[creatureType];
  //   const creature = Creature.fromConfig(creatureConfig);

  //   if (creature.requiredResources.length === 0) {
  //     return true;
  //   }

  //   const hasEnough = creature.requiredResources.every((requiredResource) => {
  //     const currentResource = currentResources.find((res) => {
  //       return res.type === requiredResource.type;
  //     });
  //     if (currentResource === undefined) {
  //       return false;
  //     }
  //     // return currentResource.amount >= requiredResource.amount;
  //     return currentResource.amount > 0;
  //   });

  //   return hasEnough;
  // }
}
