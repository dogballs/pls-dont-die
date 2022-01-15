import {
  GameObject,
  RectPainter,
  Subject,
  TextAlignment,
  TextPainter,
} from '../core';
import { GameUpdateArgs, Outcome } from '../game';
import { config } from '../config';

import { Button } from './Button';
import { ResourceItem } from './ResourceItem';

export class DeathModal extends GameObject {
  closed = new Subject<null>();
  painter = new RectPainter({
    fillColor: '#f2d78c',
    borderColor: '#b38400',
    borderWidth: 3,
  });
  zIndex = 100;

  constructor(readonly outcome: Outcome) {
    super(512, 384);
  }

  protected setup({ mouseIntersector }: GameUpdateArgs) {
    mouseIntersector.trap(this);

    const header = new GameObject(512, 58);
    header.painter = new RectPainter({
      fillColor: '#f25555',
      borderColor: '#b38400',
      borderWidth: 3,
    });
    this.add(header);

    const title = new GameObject(512, 58);
    title.painter = new TextPainter({
      text: 'Simulation failed',
      color: '#fff',
      size: 30,
      alignment: TextAlignment.MiddleCenter,
    });
    this.add(title);

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

    const continueButton = new Button('Continue');
    continueButton.updateMatrix();
    continueButton.setCenter(this.getSelfCenter());
    continueButton.position.setY(312);
    continueButton.clicked.addListener(() => {
      mouseIntersector.untrap(this);
      this.closed.notify(null);
      this.removeSelf();
    });
    this.add(continueButton);
  }
}
