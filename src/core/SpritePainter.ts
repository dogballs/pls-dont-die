import { RenderContext } from './render';

import { Painter } from './Painter';
import { Sprite } from './Sprite';
import { Rect } from './Rect';
import { RenderObject } from './RenderObject';

export enum SpriteAlignment {
  Stretch,
  MiddleCenter,
  MiddleLeft,
  TopLeft,
}

export class SpritePainter extends Painter {
  public alignment: SpriteAlignment;
  public sprite: Sprite = null;
  public opacity = 1;

  constructor(sprite: Sprite = null, alignment = SpriteAlignment.MiddleCenter) {
    super();

    this.sprite = sprite;
    this.alignment = alignment;
  }

  public paint(context: RenderContext, renderObject: RenderObject): void {
    // Simply no sprite object provided
    if (this.sprite === null) {
      return;
    }

    // Image is not yet available
    if (!this.sprite.isImageLoaded()) {
      return;
    }

    const objectRect = renderObject.getWorldBoundingBox().toRect();

    let destinationRect = objectRect;
    if (this.alignment === SpriteAlignment.Stretch) {
      destinationRect = objectRect;
    } else if (this.alignment === SpriteAlignment.TopLeft) {
      destinationRect = new Rect(
        objectRect.x,
        objectRect.y,
        this.sprite.destinationRect.width,
        this.sprite.destinationRect.height,
      );
    } else if (this.alignment === SpriteAlignment.MiddleCenter) {
      destinationRect = new Rect(
        objectRect.x +
          objectRect.width / 2 -
          this.sprite.destinationRect.width / 2,
        objectRect.y +
          objectRect.height / 2 -
          this.sprite.destinationRect.height / 2,
        this.sprite.destinationRect.width,
        this.sprite.destinationRect.height,
      );
    }

    const tmpGlobalAlpha = context.getGlobalAlpha();

    if (this.opacity !== 1) {
      context.setGlobalAlpha(this.opacity);
    }

    context.drawImage(
      this.sprite.image,
      this.sprite.sourceRect,
      destinationRect,
    );

    if (this.opacity !== 1) {
      context.setGlobalAlpha(tmpGlobalAlpha);
    }
  }
}
