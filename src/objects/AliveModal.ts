import { GameObject, TextAlignment, TextPainter } from '../core';
import { GameUpdateArgs, Outcome } from '../game';

import { Modal } from './ui';
import { ResourceList } from './ResourceList';

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

    const resourceList = new ResourceList(this.outcome.resources, {
      defaultColor: '#000',
      checkNew: true,
    });
    resourceList.updateMatrix();
    resourceList.setCenter(this.getSelfCenter());
    resourceList.position.setY(160);
    this.add(resourceList);
  }
}
