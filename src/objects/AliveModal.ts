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

    const title = new GameObject(384, 32);
    title.updateMatrix();
    title.painter = new TextPainter({
      text: 'Simulation succeeded',
      color: '#000',
      size: 30,
      alignment: TextAlignment.MiddleCenter,
    });
    title.setCenter(this.getSelfCenter());
    title.position.setY(16);
    this.add(title);

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
    continueButton.position.setY(288);
    continueButton.clicked.addListener(() => {
      mouseIntersector.untrap(this);
      this.closed.notify(null);
      this.removeSelf();
    });
    this.add(continueButton);
  }
}
