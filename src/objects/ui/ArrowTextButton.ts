import {
  GameObject,
  MouseCode,
  Sprite,
  SpritePainter,
  Subject,
  TextPainter,
} from '../../core';
import { GameUpdateArgs } from '../../game';

type State = 'active' | 'hover' | 'disabled';

export class ArrowTextButton extends GameObject {
  clicked = new Subject<null>();

  private state: State = 'active';
  private arrowSpriteMap = new Map<State, Sprite>();
  private labelColorMap = new Map<State, string>();
  private arrow: GameObject;
  private label: GameObject;

  constructor(
    private readonly direction: 'left' | 'right',
    private readonly text = undefined,
  ) {
    super(128, 32);
  }

  setDisabled(disabled: boolean) {
    if (disabled) {
      this.state = 'disabled';
    } else {
      if (this.state === 'disabled') {
        this.state = 'active';
      }
    }

    this.updateElements();
  }

  setText(text: string) {
    if (this.label) {
      (this.label.painter as TextPainter).setOptions({ text });
    }
  }

  protected setup({ mouseIntersector, spriteLoader }: GameUpdateArgs) {
    this.arrowSpriteMap.set(
      'active',
      spriteLoader.load(`arrow.${this.direction}.active`),
    );
    this.arrowSpriteMap.set(
      'hover',
      spriteLoader.load(`arrow.${this.direction}.hover`),
    );
    this.arrowSpriteMap.set(
      'disabled',
      spriteLoader.load(`arrow.${this.direction}.disabled`),
    );
    this.labelColorMap.set('active', '#323c39');
    this.labelColorMap.set('hover', '#7c948d');
    this.labelColorMap.set('disabled', '#aaa');

    this.arrow = new GameObject(32, 32);
    this.arrow.painter = new SpritePainter();
    if (this.direction === 'right') {
      this.arrow.position.setX(this.size.width - 32);
    }
    this.add(this.arrow);

    this.label = new GameObject(88, 32);
    this.label.painter = new TextPainter({
      text: this.text,
      color: '#323c39',
      alignment:
        this.direction === 'left'
          ? TextPainter.Alignment.MiddleLeft
          : TextPainter.Alignment.MiddleRight,
    });
    if (this.direction === 'left') {
      this.label.position.set(38, 0);
    } else {
      this.label.position.set(0, 0);
    }
    this.add(this.label);

    this.updateElements();

    mouseIntersector.listenEnter(this);
  }

  protected update({ mouseIntersector }: GameUpdateArgs) {
    if (this.state !== 'disabled') {
      if (mouseIntersector.isEnterAt(this)) {
        this.state = 'hover';
        this.updateElements();
      }
      if (mouseIntersector.isLeaveAt(this)) {
        this.state = 'active';
        this.updateElements();
      }
      if (mouseIntersector.isDownAt(MouseCode.LeftClick, this)) {
        this.clicked.notify(null);
      }
    }
  }

  private updateElements() {
    if (this.label) {
      (this.label.painter as TextPainter).setOptions({
        color: this.labelColorMap.get(this.state),
      });
    }
    if (this.arrow) {
      (this.arrow.painter as SpritePainter).sprite = this.arrowSpriteMap.get(
        this.state,
      );
    }
  }
}
