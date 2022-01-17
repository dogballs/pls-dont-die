import { GameObject } from '../core';
import { GameUpdateArgs, Resource } from '../game';

import { ResourceItem } from './ResourceItem';

interface ResourceListOptions {
  defaultColor?: string;
  checkNew?: boolean;
  getRequiredAmount?: (resource: Resource) => number;
}

const DEFAULT_OPTIONS: ResourceListOptions = {
  defaultColor: '#fff',
  checkNew: false,
  getRequiredAmount: undefined,
};

export class ResourceList extends GameObject {
  private options: ResourceListOptions;

  constructor(
    private resources: Resource[],
    options: ResourceListOptions = {},
  ) {
    super(182, resources.length * 40);

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  protected setup({ gameStore }: GameUpdateArgs) {
    for (const [index, resource] of this.resources.entries()) {
      let isNew = false;
      if (this.options.checkNew) {
        isNew = !gameStore.hasResource(resource.type);
      }

      const requiredAmount = this.options.getRequiredAmount
        ? this.options.getRequiredAmount(resource)
        : undefined;

      const resourceItem = new ResourceItem({
        type: resource.type,
        amount: resource.amount,
        requiredAmount,
        defaultColor: this.options.defaultColor,
        isNew,
      });
      resourceItem.position.set(0, 40 * index);
      this.add(resourceItem);
    }
  }
}
