import { GameObject, Subject } from '../core';
import { Selection } from '../game';

import { Section, Selector } from './ui';

type Choice = {
  value: number;
  label: string;
};

const choices: Choice[] = [
  { value: -30, label: '-30' },
  // { value: -25, label: '-25' },
  // { value: -20, label: '-20' },
  { value: -15, label: '-15' },
  // { value: -10, label: '-10' },
  // { value: -5, label: '-5' },
  { value: 0, label: '0' },
  // { value: 5, label: '+5' },
  // { value: 10, label: '+10' },
  { value: 15, label: '+15' },
  // { value: 20, label: '+20' },
  // { value: 25, label: '+25' },
  { value: 30, label: '+30' },
];

export class TempSelector extends GameObject {
  changed = new Subject<number>();

  private selector: Selector<number>;

  constructor(private readonly locked = false) {
    super(256, 78);
  }

  setDisabled() {
    this.selector.setDisabled();
  }

  protected setup() {
    const section = new Section({
      width: this.size.width,
      height: this.size.height,
      title: 'Temperature',
    });
    this.add(section);

    this.selector = new Selector(choices, {
      defaultValue: Selection.DEFAULT_TEMP,
      locked: this.locked,
    });
    this.selector.position.set(0, 36);
    this.selector.changed.addListener((temp) => {
      this.changed.notify(temp);
    });
    this.add(this.selector);
  }
}
