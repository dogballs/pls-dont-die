import { GameObject, Subject } from '../core';

import { Button } from './ui';

export class SimulateButton extends GameObject {
  clicked = new Subject<null>();

  private button: Button;

  constructor() {
    super(176, 48);
  }

  protected setup() {
    this.button = new Button('Simulate');
    this.add(this.button);

    this.button.clicked.addListener(() => {
      this.clicked.notify(null);
    });
  }
}
