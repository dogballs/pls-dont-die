import { GameObject, TextPainter } from '../../core';

type MultilineTextOptions = {
  color?: string;
  size?: number;
  lines?: string[];
  lineInterval?: number;
};

const DEFAULT_OPTIONS: MultilineTextOptions = {
  color: 'red',
  size: 18,
  lines: [],
  lineInterval: 0,
};

export class MultilineText extends GameObject {
  private options: MultilineTextOptions;

  constructor(options: MultilineTextOptions = {}) {
    super();

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  setLines(lines: string[]) {
    this.options.lines = lines;
    this.drawLines();
  }

  protected setup() {
    this.drawLines();
  }

  private drawLines() {
    this.removeAllChildren();

    for (const [index, line] of this.options.lines.entries()) {
      const text = new GameObject(0, this.options.size);
      text.painter = new TextPainter({
        text: line,
        color: this.options.color,
        size: this.options.size,
      });
      text.position.set(
        0,
        this.options.size * index + this.options.lineInterval * index,
      );
      this.add(text);
    }
  }
}
