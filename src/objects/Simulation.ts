import {
  Animation,
  GameObject,
  Rect,
  Sprite,
  SpritePainter,
  Subject,
} from '../core';
import { GameUpdateArgs } from '../game';
import { config } from '../config';

const SCAN_STEP = config.IS_DEV ? 5 : 1.4;
const SCAN_DESINATION_Y = 360;

class Scan extends GameObject {
  painter = new SpritePainter();
  zIndex = 90;

  private animation: Animation<Sprite>;

  constructor() {
    super(512, 128);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    this.animation = new Animation(
      [
        spriteLoader.load('scan.1', new Rect(0, 0, 512, 128)),
        spriteLoader.load('scan.2', new Rect(0, 0, 512, 128)),
        spriteLoader.load('scan.3', new Rect(0, 0, 512, 128)),
      ],
      { loop: true, delay: 0.08 },
    );
  }

  protected update(updateArgs: GameUpdateArgs) {
    this.animation.update(updateArgs.deltaTime);
    this.painter.sprite = this.animation.getCurrentFrame();
  }
}

export class Simulation extends GameObject {
  completed = new Subject<null>();
  state: 'scan' | 'done' = 'scan';

  private scan: Scan;

  constructor() {
    super(512, 512);
  }

  protected setup() {
    this.scan = new Scan();
    this.scan.position.set(0, -10);
    this.add(this.scan);
  }

  protected update() {
    if (this.state === 'done') {
      return;
    }

    if (this.scan.position.y >= SCAN_DESINATION_Y) {
      this.completed.notify(null);
      this.state = 'done';
      return;
    }

    this.scan.translateY(-SCAN_STEP);
    this.scan.updateMatrix();
  }
}
