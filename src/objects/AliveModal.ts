import {
  GameObject,
  RectPainter,
  Subject,
  TextAlignment,
  TextPainter,
} from '../core';
import { GameUpdateArgs, Outcome } from '../game';

import { Button } from './Button';
import { ResourceItem } from './ResourceItem';

export class AliveModal extends GameObject {
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
      fillColor: '#16b348',
      borderColor: '#b38400',
      borderWidth: 3,
    });
    this.add(header);

    const title = new GameObject(512, 58);
    title.painter = new TextPainter({
      text: 'Simulation succeeded',
      color: '#fff',
      size: 30,
      alignment: TextAlignment.MiddleCenter,
    });
    this.add(title);

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
