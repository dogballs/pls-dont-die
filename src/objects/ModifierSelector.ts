import { GameObject } from '../core';
import { GameUpdateArgs, Resource, ResourceType } from '../game';

import { ResourceSelector, Section } from './ui';

const MODIFIER_LIST: ResourceType[] = [
  'techium',
  'liquium',
  'sandium',
  'windium',
  'soulium',
];

export class ModifierSelector extends GameObject {
  constructor(private readonly defaultValue: ResourceType = undefined) {
    super(256, 78);
  }

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    const section = new Section({
      title: 'Modifier',
      width: this.size.width,
      height: this.size.height,
      bodyBorderWidth: 0,
      headerBorderWidth: 0,
    });
    this.add(section);

    const knownTypes = MODIFIER_LIST.filter((resourceType) => {
      return (
        resourceType === 'techium' || gameStore.isKnownResource(resourceType)
      );
    });

    const resources = knownTypes.map((resourceType) => {
      return new Resource({
        type: resourceType,
        amount:
          resourceType === 'techium'
            ? 0
            : gameStore.getResourceAmount(resourceType),
      });
    });

    const selector = new ResourceSelector(resources, {
      defaultValue: this.defaultValue,
    });
    selector.position.set(0, 36);
    selector.changed.addListener((modifier) => {
      gameState.setModifier(modifier);
    });
    this.add(selector);
  }
}
