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

    const explanation = new GameObject(400, 32);
    explanation.painter = new TextPainter({
      text: 'Note: successful simulation extracts the essence of the creature',
      color: '#777',
      size: 14,
      alignment: TextAlignment.MiddleCenter,
    });
    explanation.position.set(64, 60);
    this.add(explanation);

    const resourcesTitle = new GameObject(70, 32);
    resourcesTitle.painter = new TextPainter({
      text: 'Extracted elements:',
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
    resourceList.position.set(194, 160);
    this.add(resourceList);
  }
}
