import { GameObject, TextPainter } from '../core';

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

  constructor() {
    super(256, 64);

    this.option = options[0];
  }

  protected setup() {
    const title = new GameObject(256, 32);
    title.painter = new TextPainter('Temperature', '#fff', 18);
    this.add(title);

    const input = new GameObject(256, 32);
    input.position.set(0, 32);
    input.painter = new TextPainter(this.option.text, '#fff', 24);
    this.add(input);
  }
}
