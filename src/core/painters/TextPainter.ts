import { RenderContext } from '../render';

import { Painter } from '../Painter';
import { RenderObject } from '../RenderObject';

export enum TextAlignment {
  TopLeft,
}

export class TextPainter extends Painter {
  public text: string;
  public color: string;
  public size: number;

  constructor(text = '? no text ?', color = '#000', size = 18) {
    super();

    this.text = text;
    this.color = color;
    this.size = size;
  }

  paint(context: RenderContext, renderObject: RenderObject) {
    const objectRect = renderObject.getWorldBoundingBox().toRect();

    context.fillText(
      this.text,
      objectRect.x,
      objectRect.y,
      this.color,
      this.size,
    );
  }
}
