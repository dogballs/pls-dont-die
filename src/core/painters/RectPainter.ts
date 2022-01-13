import { RenderContext } from '../render';

import { Painter } from '../Painter';
import { RenderObject } from '../RenderObject';

export interface RectPainterOptions {
  fillColor?: string;
  borderColor?: string;
  lineWidth?: number;
}

const DEFAULT_OPTIONS: RectPainterOptions = {
  fillColor: null,
  borderColor: null,
  lineWidth: 1,
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

    const { fillColor, borderColor, lineWidth } = this.options;

    // Originally canvas draws border outside the rectangle.
    // Recalculate coordinates of the border to be inside rect - it will
    // simplify clearing rect during rendering.
    const x = rect.x + lineWidth;
    const y = rect.y + lineWidth;
    const width = rect.width - lineWidth * 2;
    const height = rect.height - lineWidth * 2;

    if (fillColor !== null) {
      context.fillRect(x, y, width, height, fillColor);
    }

    if (borderColor !== null) {
      context.strokeRect(x, y, width, height, borderColor, lineWidth);
    }
  }
}
