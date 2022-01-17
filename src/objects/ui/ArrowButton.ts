import {
  GameObject,
  MouseCode,
  Sprite,
  SpritePainter,
  Subject,
  Timer,
} from '../../core';
import { GameUpdateArgs } from '../../game';

const BLINK_DELAY = 0.32;

type State = 'active' | 'hover' | 'disabled' | 'blink';

export class ArrowButton extends GameObject {
  clicked = new Subject<null>();
  painter = new SpritePainter();

  private state: State = 'active';
  private spriteMap = new Map<State, Sprite>();
  private blinkTimer = new Timer(BLINK_DELAY);
  private wasBlinkingBeforeHover = false;

  constructor(
    private readonly direction: 'left' | 'right',
    private blinking = false,
  ) {
    super(32, 32);
  }

  setDisabled(disabled: boolean) {
    if (disabled) {
      this.state = 'disabled';
    } else {
      if (this.state === 'disabled') {
        this.state = 'active';
      }
    }

    this.painter.sprite = this.spriteMap.get(this.state);
  }

  setBlinking(blinking: boolean) {
    this.blinking = blinking;
  }

  protected setup({ mouseIntersector, spriteLoader }: GameUpdateArgs) {
    this.spriteMap.set(
      'active',
      spriteLoader.load(`arrow.${this.direction}.active`),
    );
    this.spriteMap.set(
      'hover',
      spriteLoader.load(`arrow.${this.direction}.hover`),
    );
    this.spriteMap.set(
      'disabled',
      spriteLoader.load(`arrow.${this.direction}.disabled`),
    );
    this.spriteMap.set(
      'blink',
      spriteLoader.load(`arrow.${this.direction}.blink`),
    );

    this.painter.sprite = this.spriteMap.get(this.state);

    mouseIntersector.listenEnter(this);
  }

  protected update({ deltaTime, mouseIntersector }: GameUpdateArgs) {
    if (this.state === 'disabled') {
      return;
    }

    if (mouseIntersector.isEnterAt(this)) {
      this.state = 'hover';
      this.painter.sprite = this.spriteMap.get(this.state);
    }
    if (mouseIntersector.isLeaveAt(this)) {
      this.state = 'active';
      this.painter.sprite = this.spriteMap.get(this.state);
    }
    if (mouseIntersector.isDownAt(MouseCode.LeftClick, this)) {
      this.clicked.notify(null);
    }

    if (this.blinking) {
      if (this.blinkTimer.isDone()) {
        if (this.state === 'active') {
          this.state = 'blink';
        } else if (!mouseIntersector.isInAt(this)) {
          this.state = 'active';
        }
        this.painter.sprite = this.spriteMap.get(this.state);
        this.blinkTimer.reset(BLINK_DELAY);
        return;
      }
      this.blinkTimer.update(deltaTime);
    }
  }
}
