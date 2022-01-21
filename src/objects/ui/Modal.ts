import {
  GameObject,
  RectPainter,
  Subject,
  TextAlignment,
  TextPainter,
} from '../../core';
import { GameUpdateArgs } from '../../game';

import { Button } from './Button';

interface ModalOptions {
  title?: string;
  titleBackground?: string;
  width?: number;
  height?: number;
  acceptText?: string;
  onAccept?: () => void;
  autoCloseOnAccept?: boolean;
  showAcceptButton?: boolean;
}

const DEFAULT_OPTIONS: ModalOptions = {
  titleBackground: '#b38400',
  acceptText: 'Continue',
  width: 532,
  height: 384,
  autoCloseOnAccept: true,
  showAcceptButton: true,
};

export class Modal extends GameObject {
  accepted = new Subject<null>();
  closed = new Subject<null>();
  painter = new RectPainter({
    fillColor: '#f2d78c',
    borderColor: '#b38400',
    borderWidth: 3,
  });
  zIndex = 100;

  private options: ModalOptions;
  private acceptButton: Button;
  private untrapOnClose: () => void;

  constructor(options: ModalOptions = {}) {
    super();

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.size.set(this.options.width, this.options.height);
  }

  protected setup({ mouseIntersector }: GameUpdateArgs) {
    mouseIntersector.trap(this);

    if (this.options.title) {
      const header = new GameObject(this.size.width, 58);
      header.painter = new RectPainter({
        fillColor: this.options.titleBackground,
        borderColor: '#b38400',
        borderWidth: 3,
      });
      this.add(header);

      const title = new GameObject(this.size.width, 58);
      title.painter = new TextPainter({
        text: this.options.title,
        color: '#fff',
        size: 30,
        alignment: TextAlignment.MiddleCenter,
      });
      this.add(title);
    }

    if (this.options.showAcceptButton) {
      this.acceptButton = new Button(this.options.acceptText);
      this.acceptButton.updateMatrix();
      this.acceptButton.setCenter(this.getSelfCenter());
      this.acceptButton.position.setY(this.size.height - 80);
      this.acceptButton.clicked.addListener(() => {
        this.accepted.notify(null);
        if (this.options.autoCloseOnAccept) {
          this.close();
        }
      });
      this.add(this.acceptButton);
    }

    this.untrapOnClose = () => {
      mouseIntersector.untrap(this);
    };
  }

  close() {
    this.untrapOnClose();
    this.closed.notify(null);
    this.removeSelf();
  }

  protected setAcceptText(acceptText: string) {
    this.options.acceptText = acceptText;
    this.acceptButton.setText(acceptText);
  }
}
