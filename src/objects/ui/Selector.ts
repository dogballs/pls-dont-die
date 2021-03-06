import { GameObject, Subject, TextAlignment, TextPainter } from '../../core';

import { ArrowButton } from './ArrowButton';

type Choice<T> = {
  label: string;
  value: T;
};

type SelectorOptions<T> = {
  defaultValue?: T;
  locked?: boolean;
  blinkNext?: boolean;
};

export class Selector<ChoiceValue> extends GameObject {
  changed = new Subject<ChoiceValue>();

  private options: SelectorOptions<ChoiceValue>;
  private selectedIndex;
  private arrowLeft: ArrowButton;
  private arrowRight: ArrowButton;
  private label: GameObject;

  constructor(
    private choices: Choice<ChoiceValue>[] = [],
    options: SelectorOptions<ChoiceValue> = {},
  ) {
    super(256, 32);

    this.options = Object.assign(
      {},
      {
        defaultValue: undefined,
        locked: false,
        blinkNext: false,
      },
      options,
    );
  }

  setChoices(choices: Choice<ChoiceValue>[]) {
    this.choices = choices;
    this.updateLabelText();
  }

  setDisabled(disabled) {
    this.arrowLeft.setDisabled(disabled);
    this.arrowRight.setDisabled(disabled);
  }

  select(value: ChoiceValue) {
    const index = this.choices.findIndex((choice) => choice.value === value);
    if (index !== -1) {
      this.selectIndex(index);
    }
  }

  getValue() {
    const choice = this.getSelectedChoice();
    return choice ? choice.value : undefined;
  }

  protected setup() {
    this.arrowLeft = new ArrowButton('left');
    this.arrowLeft.position.set(8, 0);
    this.arrowLeft.clicked.addListener(() => {
      this.selectPrev();
    });
    if (this.options.locked) {
      this.arrowLeft.setDisabled(true);
    }
    this.add(this.arrowLeft);

    this.arrowRight = new ArrowButton('right', this.options.blinkNext);
    this.arrowRight.position.set(216, 0);
    this.arrowRight.clicked.addListener(() => {
      this.selectNext();
    });
    if (this.options.locked) {
      this.arrowRight.setDisabled(true);
    }
    this.add(this.arrowRight);

    this.label = new GameObject(176, 32);
    this.label.position.set(40, 0);
    this.label.painter = new TextPainter({
      color: '#fff',
      size: 24,
      alignment: TextAlignment.MiddleCenter,
    });
    this.add(this.label);

    const defaultIndex = this.choices.findIndex(
      (choice) => choice.value === this.options.defaultValue,
    );
    const selectedIndex = defaultIndex >= 0 ? defaultIndex : 0;
    this.selectIndex(selectedIndex);
  }

  private getSelectedChoice() {
    return this.choices[this.selectedIndex];
  }

  private hasNext() {
    return this.selectedIndex < this.choices.length - 1;
  }

  private hasPrev() {
    return this.selectedIndex > 0;
  }

  private selectPrev() {
    const nextIndex = Math.max(this.selectedIndex - 1, 0);
    this.selectIndex(nextIndex);
  }

  private selectNext() {
    const nextIndex = Math.min(this.selectedIndex + 1, this.choices.length - 1);
    this.selectIndex(nextIndex);
  }

  private selectIndex(nextIndex: number) {
    if (this.selectedIndex === nextIndex) {
      return;
    }
    this.selectedIndex = nextIndex;
    this.updateLabelText();
    this.changed.notify(this.getSelectedChoice().value);
  }

  private updateLabelText() {
    if (this.label) {
      const painter = this.label.painter as TextPainter;
      painter.setOptions({ text: this.getSelectedChoice().label });
    }

    if (!this.options.locked) {
      if (this.arrowLeft) {
        this.arrowLeft.setDisabled(!this.hasPrev());
      }
      if (this.arrowRight) {
        this.arrowRight.setDisabled(!this.hasNext());
      }
    }
  }
}
