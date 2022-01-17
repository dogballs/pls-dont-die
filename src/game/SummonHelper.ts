import { config } from '../config';

import { Creature, CreatureType, Resource } from './GameTypes';

export class SummonHelper {
  static canSummon(
    creatureType: CreatureType,
    currentResources: Resource[],
  ): boolean {
    const creatureConfig = config.CREATURES[creatureType];
    const creature = Creature.fromConfig(creatureConfig);

    if (creature.requiredResources.length === 0) {
      return true;
    }

    const hasEnough = creature.requiredResources.every((requiredResource) => {
      const currentResource = currentResources.find((res) => {
        return res.type === requiredResource.type;
      });
      if (currentResource === undefined) {
        return false;
      }
      // return currentResource.amount >= requiredResource.amount;
      return currentResource.amount > 0;
    });

    return hasEnough;
  }
}
