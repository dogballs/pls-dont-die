import { GameObject, RectPainter } from '../core';
import { GameUpdateArgs } from '../game';

import { ResourceItem } from './ResourceItem';
import { Section } from './ui';

export class Inventory extends GameObject {
  painter = new RectPainter({
    fillColor: '#306082',
    borderColor: '#489880',
    borderWidth: 3,
  });

  constructor() {
    super(256, 200);
  }

  protected setup({ gameStore }: GameUpdateArgs) {
    const section = new Section({
      width: this.size.width,
      height: this.size.height,
      title: 'Inventory',
    });
    this.add(section);

    const resources = gameStore.getResources();

    for (const [index, resource] of resources.entries()) {
      const item = new ResourceItem(resource);
      item.position.set(16, 40 + 40 * index);
      this.add(item);
    }
  }
}
