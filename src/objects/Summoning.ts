import {
  Animation,
  GameObject,
  Rect,
  Sprite,
  SpritePainter,
  Subject,
  Timer,
} from '../core';
import { GameUpdateArgs } from '../game';

const SUMMON_ANIMATION_DELAY = 0.04;
// const SUMMON_ANIMATION_DELAY = 0;
const OPACITY_STEP = 0.05;
// const OPACITY_STEP = 1;
const OPACITY_DELAY = 0.05;

export class Summoning extends GameObject {
  painter = new SpritePainter();
  fadeInCompleted = new Subject<null>();
  fadeOutCompleted = new Subject<null>();
  completed = new Subject<null>();
  zIndex = 10;

  private animation: Animation<Sprite>;
  private fadeOutTimer: Timer = null;

  constructor() {
    super(512, 512);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    this.animation = new Animation(
      spriteLoader.loadList(
        [
          'summoning.1',
          'summoning.2',
          'summoning.3',
          'summoning.4',
          'summoning.5',
          'summoning.6',
          'summoning.7',
          'summoning.8',
          'summoning.9',
          'summoning.10',
          'summoning.11',
          'summoning.12',
          'summoning.13',
          'summoning.14',
          'summoning.15',
        ],
        new Rect(0, 0, 512, 512),
      ),
      {
        delay: SUMMON_ANIMATION_DELAY,
      },
    );
  }

  protected update(updateArgs: GameUpdateArgs) {
    if (!this.animation.isComplete()) {
      this.animation.update(updateArgs.deltaTime);
      this.painter.sprite = this.animation.getCurrentFrame();
      return;
    }

    if (this.painter.opacity === 0) {
      return;
    }

    if (this.fadeOutTimer === null) {
      this.fadeInCompleted.notify(null);
      this.fadeOutTimer = new Timer(OPACITY_DELAY);
      return;
    }

    if (this.fadeOutTimer.isDone()) {
      this.painter.opacity = Math.max(0, this.painter.opacity - OPACITY_STEP);
      this.fadeOutTimer.reset(OPACITY_DELAY);
      if (this.painter.opacity === 0) {
        this.fadeOutTimer.stop();
        this.fadeOutCompleted.notify(null);
        this.completed.notify(null);
      }
    }

    this.fadeOutTimer.update(updateArgs.deltaTime);
  }
}
