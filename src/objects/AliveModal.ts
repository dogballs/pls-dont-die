import { GameObject, TextAlignment, TextPainter } from '../core';
import { GameUpdateArgs, Outcome } from '../game';

import { Modal } from './ui';
import { ResourceItem } from './ResourceItem';

export class AliveModal extends Modal {
  constructor(readonly outcome: Outcome) {
    super({
      title: 'Simulation succeeded',
      titleBackground: '#16b348',
    });
  }

  protected setup(updateArgs: GameUpdateArgs) {
    super.setup(updateArgs);

    const resourcesTitle = new GameObject(78, 32);
    resourcesTitle.painter = new TextPainter({
      text: 'Synthesized:',
      color: '#000',
      size: 14,
      alignment: TextAlignment.MiddleCenter,
    });
    resourcesTitle.position.set(64, 160);
    this.add(resourcesTitle);

    for (const [index, resource] of this.outcome.resources.entries()) {
      const item = new ResourceItem({
        ...resource,
        defaultColor: '#000',
      });
      item.updateMatrix();
      item.setCenter(this.getSelfCenter());
      item.position.setY(160 + 40 * index);
      this.add(item);
    }
  }
}
