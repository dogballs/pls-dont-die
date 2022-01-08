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
  value: number;
  text: string;
};

const options: Option[] = [
  { value: -30, text: '-30' },
  { value: -25, text: '-25' },
  { value: -20, text: '-20' },
  { value: -15, text: '-15' },
  { value: -10, text: '-10' },
  { value: -5, text: '-5' },
  { value: 0, text: '0' },
  { value: 5, text: '+5' },
  { value: 10, text: '+10' },
  { value: 15, text: '+15' },
  { value: 20, text: '+20' },
  { value: 25, text: '+25' },
  { value: 30, text: '+30' },
];

export class TempSelector extends GameObject {
  changed = new Subject<number>();

  private selectedIndex = 6;
  private arrowLeft: GameObject;
  private arrowRight: GameObject;
  private label: GameObject;

  constructor() {
    super(256, 64);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    const title = new GameObject(256, 32);
    title.painter = new TextPainter({
      text: 'Temperature',
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
    this.updateLabelText();
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
