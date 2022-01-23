import { GameObject, Subject, TextAlignment, TextPainter } from '../core';
import { GameUpdateArgs, Outcome, StoryCheck } from '../game';
import { config } from '../config';

import { Button, IconTextButton, Modal, ResourceList } from './ui';

export class DeathModal extends Modal {
  retried = new Subject<null>();
  backed = new Subject<null>();

  constructor(readonly outcome: Outcome) {
    super({
      title: 'Simulation failed',
      titleBackground: '#f25555',
      showAcceptButton: false,
    });
  }

  protected setup(updateArgs: GameUpdateArgs) {
    super.setup(updateArgs);

    const { gameStore } = updateArgs;

    const explanation = new GameObject(400, 32);
    explanation.painter = new TextPainter({
      text: 'Note: failed simulation results in dropped modifiers',
      color: '#777',
      size: 14,
      alignment: TextAlignment.MiddleCenter,
    });
    explanation.position.set(64, 60);
    this.add(explanation);

    const deathTitle = new GameObject(78, 32);
    deathTitle.painter = new TextPainter({
      text: 'Death reason:',
      color: '#000',
      size: 14,
      alignment: TextAlignment.MiddleCenter,
    });
    deathTitle.position.set(84, 120);
    this.add(deathTitle);

    const reasonText = config.DEATH_REASONS[this.outcome.deathType];
    if (!reasonText) {
      throw new Error(
        `No death description in config for "${this.outcome.deathType}"`,
      );
    }

    const deathDescription = new GameObject(78, 32);
    deathDescription.painter = new TextPainter({
      text: reasonText,
      color: '#000',
      size: 18,
      alignment: TextAlignment.MiddleLeft,
    });
    deathDescription.position.set(194, 120);
    this.add(deathDescription);

    const resourcesTitle = new GameObject(78, 32);
    resourcesTitle.painter = new TextPainter({
      text: 'Extracted elements:',
      color: '#000',
      size: 14,
      alignment: TextAlignment.MiddleCenter,
    });
    resourcesTitle.position.set(64, 180);
    this.add(resourcesTitle);

    const resourceList = new ResourceList(this.outcome.resources, {
      defaultColor: '#000',
      checkNew: true,
      showAmount: false,
    });
    resourceList.position.set(194, 180);
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
