import { GameObject, Rect, SpritePainter, TextPainter } from '../core';
import { GameUpdateArgs } from '../game';

import { IconTextButton, Modal, MultilineText } from './ui';

export class TalkModal extends Modal {
  private messageIndex = 0;
  private text: MultilineText;
  private counter: GameObject;
  private prevButton: IconTextButton;
  private nextButton: IconTextButton;

  constructor(
    private readonly messages: string[][],
    private readonly avatar: 'doctor' | 'spirit' = 'doctor',
    private readonly mode: 'full' | 'compact' = 'full',
  ) {
    super({
      height: mode === 'full' ? 280 : 190,
      width: 768,
      autoCloseOnAccept: false,
      acceptText: messages.length > 1 ? 'Next' : 'Done',
      showAcceptButton: false,
    });
  }

  protected setup(updateArgs: GameUpdateArgs) {
    super.setup(updateArgs);

    const avatar = new GameObject(128, 128);
    avatar.painter = new SpritePainter(
      updateArgs.spriteLoader.load(
        `avatar.${this.avatar}`,
        new Rect(0, 0, 128, 128),
      ),
    );
    avatar.position.set(32, 32);
    this.add(avatar);

    this.text = new MultilineText({
      lines: this.getMessageLines(),
      size: 22,
      color: '#000',
      lineInterval: 10,
    });
    this.text.position.set(200, 42);
    this.add(this.text);

    this.prevButton = new IconTextButton({
      iconType: 'arrow.left',
      text: 'Back',
      hoverTextColor: '#7daa9d',
    });
    this.prevButton.position.set(32, 220);
    if (this.mode === 'compact') {
      this.prevButton.position.set(200, 128);
    }
    this.prevButton.clicked.addListener(() => {
      this.prev();
    });
    this.add(this.prevButton);

    this.nextButton = new IconTextButton({
      iconType: 'arrow.right',
      iconPosition: 'right',
      text: this.messages.length > 1 ? 'Next' : 'Done',
      hoverTextColor: '#7daa9d',
    });
    this.nextButton.position.set(608, 220);
    if (this.mode === 'compact') {
      this.nextButton.position.set(608, 128);
    }
    this.nextButton.clicked.addListener(() => {
      this.next();
    });
    this.add(this.nextButton);

    this.counter = new GameObject(16, 16);
    this.counter.painter = new TextPainter({
      color: '#777',
      alignment: TextPainter.Alignment.MiddleCenter,
    });
    if (this.mode === 'compact') {
      this.counter.position.set(460, 138);
    } else {
      this.counter.updateMatrix();
      this.counter.setCenter(this.getSelfCenter());
      this.counter.position.setY(226);
    }
    this.add(this.counter);

    this.accepted.addListener(() => {
      this.next();
    });

    this.updateElements();
  }

  private hasNextMessage() {
    return this.messageIndex < this.messages.length - 1;
  }

  private hasPrevMessage() {
    return this.messageIndex > 0 && this.messages.length > 1;
  }

  private getMessageLines() {
    return this.messages[this.messageIndex];
  }

  private prev() {
    if (!this.hasPrevMessage()) {
      return;
    }
    this.messageIndex -= 1;

    this.updateElements();
  }

  private next() {
    if (!this.hasNextMessage()) {
      this.close();
      return;
    }

    this.messageIndex += 1;

    this.updateElements();
  }

  private updateElements() {
    (this.counter.painter as TextPainter).setOptions({
      text: `${this.messageIndex + 1}/${this.messages.length}`,
    });

    this.nextButton.setText(this.hasNextMessage() ? 'Next' : 'Done');

    this.text.setLines(this.getMessageLines());
    this.prevButton.setDisabled(!this.hasPrevMessage());
  }
}
