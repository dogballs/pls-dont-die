import { GameObject, MouseCode, Subject, TextPainter } from '../../core';
import { GameUpdateArgs } from '../../game';

export class MainMenuItem extends GameObject {
  clicked = new Subject<null>();

  constructor(private readonly title: string) {
    super(256, 48);
  }

  protected setup({ mouseIntersector }: GameUpdateArgs) {
    this.painter = new TextPainter({
      text: this.title,
      color: '#fff',
      size: 36,
      alignment: TextPainter.Alignment.MiddleCenter,
    });

    mouseIntersector.listenEnter(this);
  }

  protected update({ mouseIntersector }: GameUpdateArgs) {
    if (mouseIntersector.isEnterAt(this)) {
      (this.painter as TextPainter).setOptions({ color: '#e9e6ab' });
    }
    if (mouseIntersector.isLeaveAt(this)) {
      (this.painter as TextPainter).setOptions({ color: '#fff' });
    }
    if (mouseIntersector.isDownAt(MouseCode.LeftClick, this)) {
      this.clicked.notify(null);
    }
  }
}
