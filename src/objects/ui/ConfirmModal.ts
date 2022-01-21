import { GameObject, Subject, TextAlignment, TextPainter } from '../../core';
import { GameUpdateArgs } from '../../game';

import { IconTextButton } from './IconTextButton';
import { Modal } from './Modal';

interface ConfirmModalOptions {
  title?: string;
  text?: string;
}

const DEFAULT_OPTIONS: ConfirmModalOptions = {
  title: 'Override save',
  text: 'Are you sure?',
};

export class ConfirmModal extends Modal {
  accepted = new Subject<null>();
  declined = new Subject<null>();

  constructor(options: ConfirmModalOptions) {
    super({
      title: options.title || DEFAULT_OPTIONS.title,
      showAcceptButton: false,
    });
  }

  protected setup(updateArgs: GameUpdateArgs) {
    super.setup(updateArgs);

    const title = new GameObject(400, 32);
    title.painter = new TextPainter({
      text: 'There is already a game in progress. This will remove the progress.',
      color: '#333',
      size: 16,
      alignment: TextAlignment.MiddleCenter,
    });
    title.updateMatrix();
    title.setCenter(this.getSelfCenter());
    title.position.setY(100);
    this.add(title);

    const description = new GameObject(70, 32);
    description.painter = new TextPainter({
      text: 'Are you sure you want to start a new game?',
      color: '#333',
      size: 20,
      alignment: TextAlignment.MiddleCenter,
    });
    description.updateMatrix();
    description.setCenter(this.getSelfCenter());
    description.position.setY(150);
    this.add(description);

    const declineButton = new IconTextButton({
      iconType: 'arrow.left',
      iconPosition: 'left',
      text: 'Cancel',
    });
    declineButton.position.set(56, 310);
    declineButton.clicked.addListener(() => {
      this.declined.notify(null);
      this.close();
    });
    this.add(declineButton);

    const acceptButton = new IconTextButton({
      iconType: 'arrow.right',
      iconPosition: 'right',
      text: 'Confirm',
    });
    acceptButton.position.set(350, 310);
    acceptButton.clicked.addListener(() => {
      this.accepted.notify(null);
      this.close();
    });
    this.add(acceptButton);
  }
}
