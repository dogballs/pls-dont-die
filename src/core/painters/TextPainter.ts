import { RenderContext } from '../render';

import { Painter } from '../Painter';
import { Rect } from '../Rect';
import { RenderObject } from '../RenderObject';

export enum TextAlignment {
  TopLeft,
  MiddleLeft,
  MiddleCenter,
}

export interface TextPainterOptions {
  text?: string;
  color?: string;
  size?: number;
  alignment?: TextAlignment;
}

const DEFAULT_OPTIONS: TextPainterOptions = {
  text: '? no text ?',
  color: 'red',
  size: 18,
  alignment: TextAlignment.TopLeft,
};

export class TextPainter extends Painter {
  private options: TextPainterOptions;

  constructor(options: TextPainterOptions = {}) {
    super();

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  setOptions(options: TextPainterOptions = {}) {
    Object.assign(this.options, options);
  }

  paint(context: RenderContext, renderObject: RenderObject) {
    const objectRect = renderObject.getWorldBoundingBox().toRect();
    const objectCenter = objectRect.getCenter();

    let vertAlign: 'top' | 'middle' | 'bottom';
    let horizAlign: 'left' | 'center' | 'right';

    let destRect = objectRect;

    switch (this.options.alignment) {
      case TextAlignment.MiddleCenter:
        vertAlign = 'middle';
        horizAlign = 'center';
        destRect = new Rect(
          objectCenter.x,
          objectCenter.y,
          objectRect.width,
          objectRect.height,
        );
        break;
      case TextAlignment.MiddleLeft:
        vertAlign = 'middle';
        horizAlign = 'left';
        destRect = new Rect(
          objectRect.x,
          objectCenter.y,
          objectRect.width,
          objectRect.height,
        );
        break;
      case TextAlignment.TopLeft:
      default:
        vertAlign = 'top';
        horizAlign = 'left';
    }

    context.fillText(
      this.options.text,
      destRect.x,
      destRect.y,
      this.options.color,
      this.options.size,
      vertAlign,
      horizAlign,
    );
  }
}
