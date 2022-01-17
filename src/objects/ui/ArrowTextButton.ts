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

interface ArrowTextButtonOptions {
  direction: 'left' | 'right';
  text: string;
  activeTextColor?: string;
  hoverTextColor?: string;
}

const DEFAULT_OPTIONS: ArrowTextButtonOptions = {
  direction: 'left',
  text: '? no text ?',
  activeTextColor: '#489880',
  hoverTextColor: '#84d74b',
};

export class ArrowTextButton extends GameObject {
  clicked = new Subject<null>();

  private options: ArrowTextButtonOptions;
  private state: State = 'active';
  private arrowSpriteMap = new Map<State, Sprite>();
  private labelColorMap = new Map<State, string>();
  private arrow: GameObject;
  private label: GameObject;

  constructor(options: ArrowTextButtonOptions) {
    super(128, 32);

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
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
      spriteLoader.load(`arrow.${this.options.direction}.active`),
    );
    this.arrowSpriteMap.set(
      'hover',
      spriteLoader.load(`arrow.${this.options.direction}.hover`),
    );
    this.arrowSpriteMap.set(
      'disabled',
      spriteLoader.load(`arrow.${this.options.direction}.disabled`),
    );
    this.labelColorMap.set('active', this.options.activeTextColor);
    this.labelColorMap.set('hover', this.options.hoverTextColor);
    this.labelColorMap.set('disabled', '#aaa');

    this.arrow = new GameObject(32, 32);
    this.arrow.painter = new SpritePainter();
    if (this.options.direction === 'right') {
      this.arrow.position.setX(this.size.width - 32);
    }
    this.add(this.arrow);

    this.label = new GameObject(88, 32);
    this.label.painter = new TextPainter({
      text: this.options.text,
      color: '#323c39',
      alignment:
        this.options.direction === 'left'
          ? TextPainter.Alignment.MiddleLeft
          : TextPainter.Alignment.MiddleRight,
    });
    if (this.options.direction === 'left') {
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
