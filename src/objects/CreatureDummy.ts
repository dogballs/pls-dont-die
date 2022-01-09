import { Animation, GameObject, Rect, Sprite, SpritePainter } from '../core';
import { GameUpdateArgs } from '../game';

export class CreatureDummy extends GameObject {
  painter = new SpritePainter();
  zIndex = 4;

  private animation: Animation<Sprite>;

  constructor() {
    super(512, 512);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    this.animation = new Animation(
      [
        spriteLoader.load('dummy.1', new Rect(0, 0, 512, 512)),
        spriteLoader.load('dummy.2', new Rect(0, 0, 512, 512)),
        spriteLoader.load('dummy.3', new Rect(0, 0, 512, 512)),
        spriteLoader.load('dummy.2', new Rect(0, 0, 512, 512)),
      ],
      { loop: true, delay: 0.32 },
    );
  }

  protected update(updateArgs: GameUpdateArgs) {
    this.animation.update(updateArgs.deltaTime);
    this.painter.sprite = this.animation.getCurrentFrame();
  }
}
