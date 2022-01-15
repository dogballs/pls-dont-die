import { GameObject, Subject } from '../core';

import { Section } from './Section';
import { Selector } from './Selector';

type Choice = {
  value: number;
  label: string;
};

const choices: Choice[] = [
  { value: -30, label: '-30' },
  { value: -25, label: '-25' },
  { value: -20, label: '-20' },
  { value: -15, label: '-15' },
  { value: -10, label: '-10' },
  { value: -5, label: '-5' },
  { value: 0, label: '0' },
  { value: 5, label: '+5' },
  { value: 10, label: '+10' },
  { value: 15, label: '+15' },
  { value: 20, label: '+20' },
  { value: 25, label: '+25' },
  { value: 30, label: '+30' },
];

const DEFAULT_VALUE = 0;

export class TempSelector extends GameObject {
  changed = new Subject<number>();

  constructor() {
    super(256, 78);
  }

  protected setup() {
    const section = new Section({
      width: this.size.width,
      height: this.size.height,
      title: 'Temperature',
    });
    this.add(section);

    const selector = new Selector(choices, {
      defaultValue: DEFAULT_VALUE,
    });
    selector.position.set(0, 36);
    selector.changed.addListener((temp) => {
      this.changed.notify(temp);
    });
    this.add(selector);
  }
}
