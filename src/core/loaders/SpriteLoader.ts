import { Rect } from '../Rect';
import { Sprite } from '../Sprite';

import { ImageLoader } from './ImageLoader';

interface SpriteManifestItem {
  file: string;
  rect: number[];
}

interface SpriteManifest {
  [id: string]: SpriteManifestItem;
}

interface SpriteLoaderOptions {
  scale?: number;
}

const DEFAULT_OPTIONS = {
  scale: 1,
};

export class SpriteLoader {
  private readonly imageLoader: ImageLoader;
  private readonly manifest: SpriteManifest;
  private readonly options: SpriteLoaderOptions;

  constructor(
    imageLoader: ImageLoader,
    manifest: SpriteManifest,
    options: SpriteLoaderOptions = {},
  ) {
    this.imageLoader = imageLoader;
    this.manifest = manifest;
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  public load(id: string, argDestinationRect?: Rect): Sprite {
    const item = this.manifest[id];
    if (item === undefined) {
      throw new Error(`Invalid sprite id = "${id}"`);
    }

    const { file: filePath, rect: sourceRectValues } = item;
    const image = this.imageLoader.load(filePath);
    const sourceRect = new Rect(...sourceRectValues);

    const defaultDestinationRect = new Rect(
      0,
      0,
      sourceRect.width * this.options.scale,
      sourceRect.height * this.options.scale,
    );

    const destinationRect = argDestinationRect ?? defaultDestinationRect;

    const sprite = new Sprite(image, sourceRect, destinationRect);

    return sprite;
  }

  public async loadAsync(
    id: string,
    destinationRect = new Rect(),
  ): Promise<Sprite> {
    return new Promise((resolve, reject) => {
      const sprite = this.load(id, destinationRect);
      if (sprite.image.isLoaded()) {
        resolve(sprite);
      } else {
        sprite.image.loaded.addListenerOnce(() => {
          resolve(sprite);
        });
        sprite.image.error.addListenerOnce((err) => {
          reject(err);
        });
      }
    });
  }

  public loadList(ids: string[]): Sprite[] {
    const sprites = ids.map((id) => {
      const sprite = this.load(id);

      return sprite;
    });

    return sprites;
  }

  public preloadAll(): void {
    Object.keys(this.manifest).forEach((id) => {
      this.load(id);
    });
  }

  public async preloadAllAsync(): Promise<void> {
    await Promise.all(
      Object.keys(this.manifest).map((id) => {
        return this.loadAsync(id);
      }),
    );
  }
}
