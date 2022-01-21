import { GameObject, Rect, Sprite, SpritePainter } from '../core';
import { GameUpdateArgs } from '../game';

const configs = [
  { value: 'desert', spriteId: 'env.desert' },
  { value: 'underwater', spriteId: 'env.underwater' },
  { value: 'air', spriteId: 'env.air' },
];

export class CageEnv extends GameObject {
  painter = new SpritePainter();
  zIndex = 2;

  private currentEnv: string = null;
  private spriteMap = new Map<string, Sprite>();

  constructor() {
    super(512, 512);
  }

  protected setup({ gameState, spriteLoader }: GameUpdateArgs) {
    this.currentEnv = gameState.env;

    for (const { value, spriteId } of configs) {
      this.spriteMap.set(
        value,
        spriteLoader.load(spriteId, new Rect(0, 0, 512, 512)),
      );
    }

    gameState.envChanged.addListener(this.handleEnvChanged);

    this.painter.opacity = 0.3;
  }

  protected update() {
    const currentSprite = this.spriteMap.get(this.currentEnv);
    if (!currentSprite) {
      this.painter.sprite = null;
      return;
    }

    this.painter.sprite = currentSprite;
  }

  private handleEnvChanged = (env) => {
    this.currentEnv = env;
  };
}
