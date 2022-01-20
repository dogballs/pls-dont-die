import { GameObject } from '../core';
import {
  Creature,
  CreatureType,
  GameUpdateArgs,
  GameStore,
  Resource,
} from '../game';
import { config } from '../config';

import { ResourceIconPair, ResourceList, Section } from './ui';

export class CreatureRequireList extends GameObject {
  private list: ResourceList;
  private pairs: ResourceIconPair[] = [];

  constructor() {
    super(256, 180);
  }

  protected setup() {
    const section = new Section({
      title: 'Required for summon',
      height: this.size.height,
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
    const resourceGroups = this.getResourceGroups(creatureType, gameStore);

    for (const pair of this.pairs) {
      this.remove(pair);
    }
    this.pairs = [];

    for (const [index, resources] of resourceGroups.entries()) {
      const rowIndex = Math.floor(index / 2);
      const colIndex = index % 2;
      const pair = new ResourceIconPair(resources[0].type, resources[1].type);
      pair.position.set(20 + 120 * colIndex, 50 + rowIndex * 50);
      this.pairs.push(pair);
      this.add(pair);
    }

    // this.remove(this.list);
    // this.list = new ResourceList(resources, {
    //   showAmount: false,
    // });
    // this.list.position.set(16, 44);
    // this.add(this.list);
  }

  private getResourceGroups(creatureType: CreatureType, gameStore: GameStore) {
    const creatureConfig = config.CREATURES[creatureType];
    const creature = Creature.fromConfig(creatureConfig);

    const resources = creature.requiredResourceGroups.map((resources) => {
      if (resources.length !== 2) {
        throw new Error(`Should be pairs for "${creatureType}"`);
      }

      if (
        !gameStore.isKnownReqPairForCreature(
          creatureType,
          resources[0].type,
          resources[1].type,
        )
      ) {
        return [Resource.createUnknown(), Resource.createUnknown()];
      }

      return resources;

      // return new Resource({
      //   type: resource.type,
      //   amount: resource.amount,
      //   // amount: gameStore.getResourceAmount(resource.type),
      // });
    });

    return resources;
  }
}
