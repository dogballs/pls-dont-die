import { GameObject } from '../core';
import {
  Creature,
  CreatureType,
  GameUpdateArgs,
  GameStore,
  Resource,
} from '../game';
import { config } from '../config';

import { ResourceList, Section } from './ui';

export class CreatureRequireList extends GameObject {
  private list: ResourceList;

  constructor() {
    super(256, 128);
  }

  protected setup() {
    const section = new Section({
      title: 'Required for summon',
      height: 128,
      bodyBorderWidth: 0,
      headerBorderWidth: 0,
    });
    this.add(section);

    // gameState.creatureChanged.addListener((creatureType) => {
    //   this.updateResources(creatureType, gameStore);
    // });
  }

  protected update({ gameState, gameStore }: GameUpdateArgs) {
    this.updateResources(gameState.databaseCreature, gameStore);
  }

  private updateResources(creatureType: CreatureType, gameStore: GameStore) {
    const resources = this.getResources(creatureType, gameStore);

    this.remove(this.list);
    this.list = new ResourceList(resources, {
      showAmount: false,
    });
    this.list.position.set(16, 44);
    this.add(this.list);
  }

  private getResources(creatureType: CreatureType, gameStore: GameStore) {
    const creatureConfig = config.CREATURES[creatureType];
    const creature = Creature.fromConfig(creatureConfig);

    const resources = creature.requiredResources.map((resource) => {
      if (!gameStore.isKnownCreature(creatureType)) {
        return Resource.createUnknown();
      }

      return new Resource({
        type: resource.type,
        amount: resource.amount,
        // amount: gameStore.getResourceAmount(resource.type),
      });
    });

    return resources;
  }
}
