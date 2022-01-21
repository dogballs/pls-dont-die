import { GameObject, Subject, TextAlignment, TextPainter } from '../core';
import { GameUpdateArgs, Outcome, StoryCheck } from '../game';

import { Button, IconTextButton, Modal, ResourceList } from './ui';

export class AliveModal extends Modal {
  retried = new Subject<null>();
  backed = new Subject<null>();

  constructor(readonly outcome: Outcome) {
    super({
      title: 'Simulation succeeded',
      titleBackground: '#16b348',
      showAcceptButton: false,
    });
  }

  protected setup(updateArgs: GameUpdateArgs) {
    super.setup(updateArgs);

    const { gameStore } = updateArgs;

    const explanation = new GameObject(400, 32);
    explanation.painter = new TextPainter({
      text: 'Note: successful simulation extracts the essence from the creature',
      color: '#777',
      size: 14,
      alignment: TextAlignment.MiddleCenter,
    });
    explanation.position.set(64, 60);
    this.add(explanation);

    const resourcesTitle = new GameObject(70, 32);
    resourcesTitle.painter = new TextPainter({
      text: 'Extracted elements:',
      color: '#000',
      size: 14,
      alignment: TextAlignment.MiddleCenter,
    });
    resourcesTitle.position.set(64, 160);
    this.add(resourcesTitle);

    const resourceList = new ResourceList(this.outcome.resources, {
      defaultColor: '#000',
      checkNew: true,
    });
    resourceList.position.set(194, 160);
    this.add(resourceList);

    const storyStep = gameStore.getStoryStep();
    if (StoryCheck.isAfterTutorial(storyStep)) {
      const backButton = new IconTextButton({
        iconType: 'arrow.left',
        iconPosition: 'left',
        text: 'Reactor',
      });
      backButton.position.set(56, 310);
      backButton.clicked.addListener(() => {
        this.backed.notify(null);
        this.close();
      });
      this.add(backButton);

      const retryButton = new IconTextButton({
        iconType: 'reload',
        iconPosition: 'right',
        text: 'Retry',
      });
      retryButton.position.set(350, 310);
      retryButton.clicked.addListener(() => {
        this.retried.notify(null);
        this.close();
      });
      this.add(retryButton);
    } else {
      const acceptButton = new Button('Continue');
      acceptButton.updateMatrix();
      acceptButton.setCenter(this.getSelfCenter());
      acceptButton.position.setY(this.size.height - 80);
      acceptButton.clicked.addListener(() => {
        this.accepted.notify(null);
        this.close();
      });
      this.add(acceptButton);
    }
  }
}
