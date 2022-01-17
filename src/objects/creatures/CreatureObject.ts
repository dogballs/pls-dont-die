import { GameObject, Rect, SpritePainter, Timer } from '../../core';
import { CreatureType, GameUpdateArgs } from '../../game';

const STEP_OFFSETS = [-1, -1, +1, +1];
const STEP_DELAY = 0.32;

export class CreatureObject extends GameObject {
  zIndex = 4;

  private stepIndex = 0;
  private timer = new Timer(STEP_DELAY);

  constructor(private readonly type: CreatureType) {
    super(512, 512);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    this.painter = new SpritePainter(
      spriteLoader.load(`creature.${this.type}`, new Rect(0, 0, 512, 512)),
    );

    const shadow = new GameObject(128, 32);
    shadow.painter = new SpritePainter(
      spriteLoader.load('shadow', new Rect(0, 0, 128, 32)),
    );
    shadow.updateMatrix();
    shadow.setCenter(this.getSelfCenter());
    shadow.position.setY(400);
    this.add(shadow);
  }

  protected update(updateArgs: GameUpdateArgs) {
    if (this.timer.isDone()) {
      this.stepIndex += 1;
      if (this.stepIndex > STEP_OFFSETS.length - 1) {
        this.stepIndex = 0;
      }
      this.translateY(STEP_OFFSETS[this.stepIndex]);
      this.updateMatrix();
      this.timer.reset(STEP_DELAY);
      return;
    }

    this.timer.update(updateArgs.deltaTime);
  }
}
