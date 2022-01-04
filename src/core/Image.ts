import { Subject } from './Subject';
/**
 * Image represents entire image file, which might also be a spritesheet.
 * In case with spritesheets - one image may be reused a number of times.
 * Should be used to create Sprites.
 */
export class Image {
  public readonly loaded = new Subject();
  public readonly error = new Subject();
  private readonly imageElement: HTMLImageElement;

  constructor(imageElement: HTMLImageElement) {
    this.imageElement = imageElement;
    this.attachListeners();
  }

  public getElement(): HTMLImageElement {
    return this.imageElement;
  }

  public getWidth(): number {
    return this.imageElement.naturalWidth;
  }

  public getHeight(): number {
    return this.imageElement.naturalHeight;
  }

  public isLoaded(): boolean {
    return this.imageElement.complete;
  }

  private attachListeners() {
    this.imageElement.addEventListener('load', this.handleLoaded);
    this.imageElement.addEventListener('error', this.handleError);
  }

  private detachListeners() {
    this.imageElement.removeEventListener('load', this.handleLoaded);
    this.imageElement.removeEventListener('error', this.handleError);
  }

  private handleLoaded = (): void => {
    this.loaded.notify(null);
    this.detachListeners();
  };

  private handleError = (): void => {
    this.error.notify(
      new Error(`ImageLoader: Failed to load ${this.imageElement.src}`),
    );
    this.detachListeners();
  };
}
