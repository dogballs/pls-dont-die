import { GameObject } from '../core';
import { GameUpdateArgs, Resource, ResourceType } from '../game';

import { ResourceSelector, Section } from './ui';

const ESSENCE_LIST: ResourceType[] = ['dummium', 'fishium', 'arachium'];

export class EssenceSelector extends GameObject {
  constructor() {
    super(256, 78);
  }

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    const section = new Section({
      title: 'Essence',
      width: this.size.width,
      height: this.size.height,
      bodyBorderWidth: 0,
      headerBorderWidth: 0,
    });
    this.add(section);

    const knownTypes = ESSENCE_LIST.filter((resourceType) => {
      return (
        resourceType === 'dummium' || gameStore.isKnownResource(resourceType)
      );
    });

    const resources = knownTypes.map((resourceType) => {
      return new Resource({
        type: resourceType,
        amount:
          resourceType === 'dummium'
            ? Infinity
            : gameStore.getResourceAmount(resourceType),
      });
    });

    const selector = new ResourceSelector(resources, {
      getRequiredAmount: () => 1,
    });
    selector.position.set(0, 36);
    selector.changed.addListener((essence) => {
      gameState.setEssence(essence);
    });
    this.add(selector);
  }
}
