import { Image } from '../Image';
import { Rect } from '../Rect';
import { Vector } from '../Vector';

import { RenderContext } from './RenderContext';

interface CanvasRenderContextOptions {
  fontFace?: string;
  imageSmoothing?: boolean;
}

const DEFAULT_OPTIONS: CanvasRenderContextOptions = {
  fontFace: 'sans-serif',
  imageSmoothing: false,
};

export class CanvasRenderContext extends RenderContext {
  private context: CanvasRenderingContext2D;
  private options: CanvasRenderContextOptions;

  constructor(
    canvas: HTMLCanvasElement,
    options: CanvasRenderContextOptions = {},
  ) {
    super(canvas);

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  public init(): void {
    this.context = this.canvas.getContext('2d');
    this.context.imageSmoothingEnabled = this.options.imageSmoothing;
  }

  public drawImage(
    imageSource: Image,
    sourceRect: Rect,
    destinationRect: Rect,
  ): void {
    this.context.drawImage(
      imageSource.getElement(),
      sourceRect.x,
      sourceRect.y,
      sourceRect.width,
      sourceRect.height,
      Math.round(destinationRect.x),
      Math.round(destinationRect.y),
      destinationRect.width,
      destinationRect.height,
    );
  }

  public clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public clearRect(x: number, y: number, width: number, height: number): void {
    this.context.clearRect(x, y, width, height);
  }

  public fillRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color = '#000',
  ): void {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
  }

  public getGlobalAlpha(): number {
    return this.context.globalAlpha;
  }

  public setGlobalAlpha(alpha: number): void {
    this.context.globalAlpha = alpha;
  }

  public resetAlpha(): void {
    this.context.globalAlpha = 1;
  }

  public setFilter(filter: string): void {
    this.context.filter = filter;
  }

  public getFilter(): string {
    return this.context.filter;
  }

  public strokePath(positions: Vector[], color = '#000'): void {
    if (positions.length < 1) {
      return;
    }

    const [firstPosition, ...restPositions] = positions;

    this.context.beginPath();
    this.context.moveTo(firstPosition.x, firstPosition.y);

    for (const position of restPositions) {
      this.context.lineTo(position.x, position.y);
    }

    this.context.closePath();

    this.context.strokeStyle = color;
    this.context.stroke();
  }

  public strokeRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color = '#000',
    lineWidth = 1,
  ): void {
    this.context.strokeStyle = color;
    this.context.lineWidth = lineWidth;
    this.context.strokeRect(x, y, width, height);
  }

  public fillText(
    text: string,
    x: number,
    y: number,
    color: string,
    size: number,
    vertAlign: 'top' | 'middle' | 'bottom' = 'top',
    horizAlign: 'left' | 'center' | 'right' = 'left',
  ) {
    this.context.textAlign = horizAlign;
    this.context.textBaseline = vertAlign;
    this.context.font = `${size}px ${this.options.fontFace}`;
    this.context.fillStyle = color;
    this.context.fillText(text, x, y);
  }
}
