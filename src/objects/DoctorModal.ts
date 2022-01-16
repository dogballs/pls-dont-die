import { GameObject, Rect, SpritePainter } from '../core';
import { GameUpdateArgs } from '../game';

import { Modal, MultilineText } from './ui';

export class DoctorModal extends Modal {
  private messageIndex = 0;
  private text: MultilineText;

  constructor(
    private readonly messages: string[][],
    private readonly mode: 'full' | 'compact' = 'full',
  ) {
    super({
      height: mode === 'full' ? 280 : 190,
      width: 768,
      autoCloseOnAccept: false,
      acceptText: messages.length > 1 ? 'Next' : 'Done',
    });
  }

  protected setup(updateArgs: GameUpdateArgs) {
    super.setup(updateArgs);

    const avatar = new GameObject(128, 128);
    avatar.painter = new SpritePainter(
      updateArgs.spriteLoader.load('doctor', new Rect(0, 0, 128, 128)),
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

    this.accepted.addListener(() => {
      this.next();
    });
  }

  private hasNextMessage() {
    return this.messageIndex < this.messages.length - 1;
  }

  private getMessageLines() {
    return this.messages[this.messageIndex];
  }

  private next() {
    if (!this.hasNextMessage()) {
      this.close();
      return;
    }

    this.messageIndex += 1;
    this.text.setLines(this.getMessageLines());

    if (!this.hasNextMessage()) {
      this.setAcceptText('Done');
    }
  }
}
