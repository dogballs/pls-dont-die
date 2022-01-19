import { GameObject, RectPainter } from '../core';
import { GameUpdateArgs } from '../game';

import { ResourceList, Section } from './ui';

export class Inventory extends GameObject {
  painter = new RectPainter({
    fillColor: '#306082',
    borderColor: '#489880',
    borderWidth: 3,
  });

  constructor() {
    super(266, 200);
  }

  protected setup({ gameStore }: GameUpdateArgs) {
    const section = new Section({
      width: this.size.width,
      height: this.size.height,
      title: 'Inventory',
    });
    this.add(section);

    const resources = gameStore.getResources();

    const list = new ResourceList(resources);
    list.position.set(16, 40);
    this.add(list);
  }
}
