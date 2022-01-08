import { Animation, GameObject, Rect, Sprite, SpritePainter } from '../core';
import { GameUpdateArgs } from '../game';

const animationConfigs = [
  { value: -5, type: 'cold.low', delay: 0.64 },
  { value: -10, type: 'cold.low', delay: 0.32 },
  { value: -15, type: 'cold.medium', delay: 0.64 },
  { value: -20, type: 'cold.medium', delay: 0.32 },
  { value: -25, type: 'cold.high', delay: 0.64 },
  { value: -30, type: 'cold.high', delay: 0.32 },
  { value: 5, type: 'heat.low', delay: 0.64 },
  { value: 10, type: 'heat.low', delay: 0.32 },
  { value: 15, type: 'heat.medium', delay: 0.64 },
  { value: 20, type: 'heat.medium', delay: 0.32 },
  { value: 25, type: 'heat.high', delay: 0.64 },
  { value: 30, type: 'heat.high', delay: 0.32 },
];

export class CageTemp extends GameObject {
  painter = new SpritePainter();
  zIndex = 5;

  private currentTemp: number = null;
  private animationMap = new Map<number, Animation<Sprite>>();

  constructor() {
    super(512, 512);
  }

  protected setup({ gameState, spriteLoader }: GameUpdateArgs) {
    this.currentTemp = gameState.temp;

    for (const { value, type, delay } of animationConfigs) {
      this.animationMap.set(
        value,
        new Animation(
          [
            spriteLoader.load(`${type}.1`, new Rect(0, 0, 512, 512)),
            spriteLoader.load(`${type}.2`, new Rect(0, 0, 512, 512)),
          ],
          { loop: true, delay },
        ),
      );
    }

    gameState.tempChanged.addListener(this.handleTempChanged);
  }

  protected update(updateArgs: GameUpdateArgs) {
    const currentAnimation = this.animationMap.get(this.currentTemp);
    if (!currentAnimation) {
      this.painter.sprite = null;
      return;
    }

    currentAnimation.update(updateArgs.deltaTime);
    this.painter.sprite = currentAnimation.getCurrentFrame();
  }

  private handleTempChanged = (temp) => {
    this.currentTemp = temp;
  };
}
