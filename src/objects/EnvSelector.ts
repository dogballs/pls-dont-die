import { GameObject, Subject } from '../core';
import { EnvType, Selection } from '../game';

import { Section, Selector } from './ui';

type Choice = {
  value: EnvType;
  label: string;
};

const choices: Choice[] = [
  { value: 'none', label: 'none' },
  { value: 'underwater', label: 'underwater' },
  { value: 'desert', label: 'desert' },
  { value: 'air', label: 'air' },
];

export class EnvSelector extends GameObject {
  changed = new Subject<EnvType>();

  private selector: Selector<EnvType>;

  constructor(private readonly locked = false) {
    super(256, 78);
  }

  setDisabled(disabled) {
    this.selector.setDisabled(disabled);
  }

  protected setup() {
    const section = new Section({
      width: this.size.width,
      height: this.size.height,
      title: 'Environment',
    });
    this.add(section);

    this.selector = new Selector(choices, {
      locked: this.locked,
      defaultValue: Selection.DEFAULT_ENV,
    });
    this.selector.position.set(0, 36);
    this.selector.changed.addListener((env) => {
      this.changed.notify(env);
    });
    this.add(this.selector);
  }
}
