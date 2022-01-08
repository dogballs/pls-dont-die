import {
  GameObject,
  MouseCode,
  SpritePainter,
  TextAlignment,
  TextPainter,
} from '../core';
import { GameUpdateArgs } from '../game';

type Option = {
  value: string;
  text: string;
};

const options: Option[] = [
  { value: 'bright', text: 'bright' },
  { value: 'normal', text: 'normal' },
  { value: 'dark', text: 'dark' },
];

export class LightSelector extends GameObject {
  private selectedIndex = 1;
  private arrowLeft: GameObject;
  private arrowRight: GameObject;
  private label: GameObject;

  constructor() {
    super(256, 64);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    const title = new GameObject(256, 32);
    title.painter = new TextPainter({
      text: 'Light',
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
    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
    this.updateLabelText();
  }

  private selectNext() {
    this.selectedIndex = Math.min(this.selectedIndex + 1, options.length - 1);
    this.updateLabelText();
  }

  private updateLabelText() {
    const painter = this.label.painter as TextPainter;
    painter.setOptions({ text: this.getSelectedOption().text });
  }
}
