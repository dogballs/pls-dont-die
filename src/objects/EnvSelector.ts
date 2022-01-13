import {
  GameObject,
  MouseCode,
  SpritePainter,
  Subject,
  TextAlignment,
  TextPainter,
} from '../core';
import { GameUpdateArgs } from '../game';

type Option = {
  value: string;
  text: string;
};

const options: Option[] = [
  { value: 'none', text: 'none' },
  { value: 'underwater', text: 'underwater' },
  { value: 'desert', text: 'desert' },
  // { value: 'forest', text: 'forest' },
];

const DEFAULT_OPTION_INDEX = 0;

export class EnvSelector extends GameObject {
  changed = new Subject<string>();

  private selectedIndex;
  private arrowLeft: GameObject;
  private arrowRight: GameObject;
  private label: GameObject;

  constructor() {
    super(256, 64);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    const title = new GameObject(256, 32);
    title.painter = new TextPainter({
      text: 'Environment',
      color: '#fff',
      size: 18,
    });
    this.add(title);

    this.arrowLeft = new GameObject(32, 32);
    this.arrowLeft.position.set(0, 32);
    this.arrowLeft.painter = new SpritePainter(spriteLoader.load('arrowLeft'));
    this.add(this.arrowLeft);

    this.arrowRight = new GameObject(32, 32);
    this.arrowRight.position.set(224, 32);
    this.arrowRight.painter = new SpritePainter(
      spriteLoader.load('arrowRight'),
    );
    this.add(this.arrowRight);

    this.label = new GameObject(192, 32);
    this.label.position.set(32, 32);
    this.label.painter = new TextPainter({
      color: '#fff',
      size: 24,
      alignment: TextAlignment.MiddleCenter,
    });
    this.add(this.label);

    this.selectIndex(DEFAULT_OPTION_INDEX);
  }

  protected update({ mouseIntersector }: GameUpdateArgs) {
    if (mouseIntersector.isDownAt(MouseCode.LeftClick, this.arrowLeft)) {
      this.selectPrev();
    }
    if (mouseIntersector.isDownAt(MouseCode.LeftClick, this.arrowRight)) {
      this.selectNext();
    }
  }

  private getSelectedOption() {
    return options[this.selectedIndex];
  }

  private selectPrev() {
    const nextIndex = Math.max(this.selectedIndex - 1, 0);
    this.selectIndex(nextIndex);
  }

  private selectNext() {
    const nextIndex = Math.min(this.selectedIndex + 1, options.length - 1);
    this.selectIndex(nextIndex);
  }

  private selectIndex(nextIndex: number) {
    if (this.selectedIndex === nextIndex) {
      return;
    }
    this.selectedIndex = nextIndex;
    this.updateLabelText();
    this.changed.notify(this.getSelectedOption().value);
  }

  private updateLabelText() {
    const painter = this.label.painter as TextPainter;
    painter.setOptions({ text: this.getSelectedOption().text });
  }
}
