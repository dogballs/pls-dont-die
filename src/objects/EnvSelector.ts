import { GameObject, Subject } from '../core';
import { EnvType } from '../game';

import { Section } from './Section';
import { Selector } from './Selector';

type Choice = {
  value: EnvType;
  label: string;
};

const choices: Choice[] = [
  { value: 'none', label: 'none' },
  { value: 'underwater', label: 'underwater' },
  { value: 'desert', label: 'desert' },
];

export class EnvSelector extends GameObject {
  changed = new Subject<EnvType>();

  constructor() {
    super(256, 78);
  }

  protected setup() {
    const section = new Section({
      width: this.size.width,
      height: this.size.height,
      title: 'Environment',
    });
    this.add(section);

    const selector = new Selector(choices);
    selector.position.set(0, 36);
    selector.changed.addListener((env) => {
      this.changed.notify(env);
    });
    this.add(selector);
  }
}
