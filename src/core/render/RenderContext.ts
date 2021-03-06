import { Image } from '../Image';
import { Rect } from '../Rect';
import { Vector } from '../Vector';

export abstract class RenderContext {
  protected canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  abstract init(): void;
  abstract clear(): void;
  abstract clearRect(x: number, y: number, width: number, height: number): void;
  abstract drawImage(
    imageSource: Image,
    sourceRect: Rect,
    destinationRect: Rect,
  );
  abstract fillRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
  );
  abstract getGlobalAlpha(): number;
  abstract setGlobalAlpha(alpha: number);
  abstract getFilter(): string;
  abstract setFilter(filter: string);
  abstract strokePath(positions: Vector[], color: string);
  abstract strokeRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color?: string,
    lineWidth?: number,
  );
  abstract fillText(
    text: string,
    x: number,
    y: number,
    color: string,
    size: number,
    vertAlign: 'top' | 'middle' | 'bottom',
    horizAlign: 'left' | 'center' | 'right',
  ): void;
}
