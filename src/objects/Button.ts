import {
  GameObject,
  Sprite,
  SpritePainter,
  Subject,
  TextAlignment,
  TextPainter,
} from '../core';
import { GameUpdateArgs } from '../game';

type State = 'active' | 'hover' | 'disabled';

export class Button extends GameObject {
  painter = new SpritePainter();
  clicked = new Subject<null>();

  private state: State;
  private text: string;
  private label: GameObject;
  private spriteMap = new Map<State, Sprite>();

  constructor(text = '? no text ?', state: State = 'active') {
    super(176, 48);

    this.text = text;
    this.state = state;
  }

  setDisabled(disabled: boolean) {
    if (disabled) {
      this.state = 'disabled';
    } else {
      this.state = 'active';
    }
    this.painter.sprite = this.spriteMap.get(this.state);
  }

  protected setup({ mouseIntersector, spriteLoader }: GameUpdateArgs) {
    this.spriteMap.set('active', spriteLoader.load('button.active'));
    this.spriteMap.set('hover', spriteLoader.load('button.hover'));
    this.spriteMap.set('disabled', spriteLoader.load('button.disabled'));

    this.label = new GameObject(176, 48);
    this.label.painter = new TextPainter({
      text: this.text,
      color: '#323c39',
      alignment: TextAlignment.MiddleCenter,
    });
    this.add(this.label);

    this.painter.sprite = this.spriteMap.get(this.state);

    mouseIntersector.listenEnter(this);
  }

  protected update({ mouseIntersector }: GameUpdateArgs) {
    if (this.state !== 'disabled') {
      if (mouseIntersector.isEnterAt(this)) {
        this.painter.sprite = this.spriteMap.get('hover');
      }
      if (mouseIntersector.isLeaveAt(this)) {
        this.painter.sprite = this.spriteMap.get('active');
      }
    }
  }
}