import { GameObject, RectPainter, TextPainter } from '../../core';

interface SectionOptions {
  width?: number;
  height?: number;
  title?: string;
  titleColor?: string;
  titleHeight?: number;
  titleTextSize?: number;
  theme?: 'blue';
  bodyBorderWidth?: number;
  headerBorderWidth?: number;
}

const DEFAULT_OPTIONS: SectionOptions = {
  height: 32,
  width: 256,
  titleColor: '#489880',
  titleHeight: 32,
  titleTextSize: 16,
  theme: 'blue',
  bodyBorderWidth: 3,
  headerBorderWidth: 3,
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
      borderWidth: this.options.bodyBorderWidth,
    });
  }

  protected setup() {
    const header = new GameObject(this.options.width, this.options.titleHeight);
    header.painter = new RectPainter({
      fillColor: '#133c59',
      borderColor: '#489880',
      borderWidth: this.options.headerBorderWidth,
    });
    this.add(header);

    const title = new GameObject(this.options.width, this.options.titleHeight);
    title.painter = new TextPainter({
      text: this.options.title,
      color: this.options.titleColor,
      size: this.options.titleTextSize,
      alignment: TextPainter.Alignment.MiddleCenter,
    });
    this.add(title);
  }
}
