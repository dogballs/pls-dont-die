import { GameObject, MouseCode, TextPainter } from '../core';
import { GameUpdateArgs } from '../game';

type Option = {
  value: number;
  text: string;
};

const options: Option[] = [
  { value: 10, text: '10' },
  { value: 20, text: '20' },
];

export class TemperatureSelector extends GameObject {
  private option: Option;
  private input: GameObject;

  constructor() {
    super(256, 64);

    this.option = options[0];
  }

  protected setup() {
    const title = new GameObject(256, 32);
    title.painter = new TextPainter('Temperature', '#fff', 18);
    this.add(title);

    this.input = new GameObject(256, 32);
    this.input.position.set(0, 32);
    this.input.painter = new TextPainter(this.option.text, '#fff', 24);
    this.add(this.input);
  }

  protected update({ mouseInput }: GameUpdateArgs) {
    if (mouseInput.isDown(MouseCode.LeftClick)) {
      const box = this.input.getWorldBoundingBox();
      const point = mouseInput.getDownPoint(MouseCode.LeftClick);
      const isClicked = box.containsPoint(point);
      if (isClicked) {
        console.log('CLICKED');
      }
    }
  }
}
