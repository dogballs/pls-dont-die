import { GameObject } from '../core';
import {
  Creature,
  CreatureType,
  GameUpdateArgs,
  GameStore,
  Resource,
  ResourceType,
} from '../game';
import { config } from '../config';

import { ResourceList, Section } from './ui';

export class CreatureDropList extends GameObject {
  private list: ResourceList;

  constructor() {
    super(256, 128);
  }

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    const section = new Section({
      title: 'Drops elements',
      height: 128,
      bodyBorderWidth: 0,
      headerBorderWidth: 0,
    });
    this.add(section);

    gameState.databaseCreatureChanged.addListener((creatureType) => {
      this.updateResources(creatureType, gameStore);
    });

    this.updateResources(gameState.databaseCreature, gameStore);
  }

  private updateResources(creatureType: CreatureType, gameStore: GameStore) {
    const resources = this.getResources(creatureType, gameStore);

    this.remove(this.list);
    this.list = new ResourceList(resources, {
      showAmount: false,
    });
    this.list.position.set(18, 44);
    this.add(this.list);
  }

  private getResources(creatureType: CreatureType, gameStore: GameStore) {
    const creatureConfig = config.CREATURES[creatureType];
    const creature = Creature.fromConfig(creatureConfig);

    const resources = creature.droppedResources.map((resource) => {
      return new Resource({
        type: gameStore.isKnownDropForCreature(creatureType, resource.type)
          ? resource.type
          : ('unknown' as ResourceType),
        amount: 1,
      });
    });

    return resources;
  }
}
