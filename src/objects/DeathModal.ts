import { GameObject, TextAlignment, TextPainter } from '../core';
import { GameUpdateArgs, Outcome } from '../game';
import { config } from '../config';

import { Modal } from './ui';
import { ResourceList } from './ResourceList';

export class DeathModal extends Modal {
  constructor(readonly outcome: Outcome) {
    super({
      title: 'Simulation failed',
      titleBackground: '#f25555',
    });
  }

  protected setup(updateArgs: GameUpdateArgs) {
    super.setup(updateArgs);

    const deathTitle = new GameObject(78, 32);
    deathTitle.painter = new TextPainter({
      text: 'Death reason:',
      color: '#000',
      size: 14,
      alignment: TextAlignment.MiddleCenter,
    });
    deathTitle.position.set(64, 90);
    this.add(deathTitle);

    const reasonText = config.DEATH_REASONS[this.outcome.deathType];
    if (!reasonText) {
      throw new Error(
        `No death description in config for "${this.outcome.deathType}"`,
      );
    }

    const deathDescription = new GameObject(78, 32);
    deathDescription.painter = new TextPainter({
      text: reasonText,
      color: '#000',
      size: 18,
      alignment: TextAlignment.MiddleLeft,
    });
    deathDescription.position.set(180, 90);
    this.add(deathDescription);

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
