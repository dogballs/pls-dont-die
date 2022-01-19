import { RenderContext } from '../render';

import { Painter } from '../Painter';
import { RenderObject } from '../RenderObject';

export interface RectPainterOptions {
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

const DEFAULT_OPTIONS: RectPainterOptions = {
  fillColor: null,
  borderColor: null,
  borderWidth: 1,
};

export class RectPainter extends Painter {
  private options: RectPainterOptions;

  constructor(options: RectPainterOptions = {}) {
    super();

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  public paint(context: RenderContext, renderObject: RenderObject): void {
    const box = renderObject.getWorldBoundingBox();
    const rect = box.toRect();

    const { fillColor, borderColor, borderWidth } = this.options;

    // Originally canvas draws border outside the rectangle.
    // Recalculate coordinates of the border to be inside rect - it will
    // simplify clearing rect during rendering.
    const x = rect.x + borderWidth;
    const y = rect.y + borderWidth;
    const width = rect.width - borderWidth * 2;
    const height = rect.height - borderWidth * 2;

    if (fillColor !== null) {
      context.fillRect(x, y, width, height, fillColor);
    }

    if (borderColor !== null && borderWidth !== 0) {
      context.strokeRect(x, y, width, height, borderColor, borderWidth);
    }
  }
}
