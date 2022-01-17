import { GameObject, RectPainter, TextPainter } from '../../core';

interface SectionOptions {
  width?: number;
  height?: number;
  title?: string;
  titleColor?: string;
}

const DEFAULT_OPTIONS: SectionOptions = {
  height: 32,
  width: 256,
  titleColor: '#489880',
};

export class Section extends GameObject {
  private readonly options: SectionOptions;

  constructor(argOptions: SectionOptions = {}) {
    const options = Object.assign({}, DEFAULT_OPTIONS, argOptions);

    super(options.width, options.height);

    this.options = options;
    this.painter = new RectPainter({
      fillColor: '#306082',
      borderColor: '#489880',
      borderWidth: 3,
    });
  }

  protected setup() {
    const header = new GameObject(this.options.width, 32);
    header.painter = new RectPainter({
      fillColor: '#133c59',
      borderColor: '#489880',
      borderWidth: 3,
    });
    this.add(header);

    const title = new GameObject(this.options.width, 32);
    title.painter = new TextPainter({
      text: this.options.title,
      color: this.options.titleColor,
      size: 16,
      alignment: TextPainter.Alignment.MiddleCenter,
    });
    this.add(title);
  }
}
