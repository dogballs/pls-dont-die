import {
  GameObject,
  MouseCode,
  Sprite,
  SpritePainter,
  Subject,
} from '../../core';
import { GameUpdateArgs } from '../../game';

type State = 'active' | 'hover' | 'disabled';

export class ArrowButton extends GameObject {
  clicked = new Subject<null>();
  painter = new SpritePainter();

  private state: State = 'active';
  private spriteMap = new Map<State, Sprite>();

  constructor(private readonly direction: 'left' | 'right') {
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

    this.painter.sprite = this.spriteMap.get(this.state);

    mouseIntersector.listenEnter(this);
  }

  protected update({ mouseIntersector }: GameUpdateArgs) {
    if (this.state !== 'disabled') {
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
    }
  }
}
