import { GameObject, SpritePainter, TextPainter } from '../core';
import { GameUpdateArgs, StoryStep } from '../game';
import { MainMenuItem } from '../objects';

import { GameSceneType } from './GameSceneType';
import { GameScene } from './GameScene';

export class MainMenuScene extends GameScene {
  protected setup({ gameStore, spriteLoader }: GameUpdateArgs) {
    const canContinue = gameStore.hasSavedGame();
    const storyStep = gameStore.getStoryStep();

    const title = new GameObject(512, 128);
    title.position.set(256, 64);
    title.painter = new SpritePainter(spriteLoader.load('main.title.1'));
    this.root.add(title);

    const disclaimer = new GameObject(512, 32);
    disclaimer.painter = new TextPainter({
      text: '* Game is played with a mouse',
      color: '#999',
      alignment: TextPainter.Alignment.MiddleCenter,
    });
    disclaimer.updateMatrix();
    disclaimer.setCenter(this.root.getSelfCenter());
    disclaimer.position.setY(512);
    this.root.add(disclaimer);

    if (canContinue) {
      const continueGameItem = new MainMenuItem('CONTINUE');
      continueGameItem.painter = new TextPainter({
        text: 'NEW GAME',
        color: '#fff',
        size: 36,
        alignment: TextPainter.Alignment.MiddleCenter,
      });
      continueGameItem.position.set(384, 256);
      continueGameItem.clicked.addListener(() => {
        this.startGame(storyStep);
      });
      this.root.add(continueGameItem);
    }

    const continueAddHeight = canContinue ? 56 : 0;

    const newGameItem = new MainMenuItem('NEW GAME');
    newGameItem.position.set(384, 256 + continueAddHeight);
    newGameItem.clicked.addListener(() => {
      if (canContinue) {
        // TODO: draw a modal
        const confirmed = window.confirm(
          'You already have a saved game. Do you want to erase it and start a new game?',
        );
        if (confirmed) {
          gameStore.reset();
          this.startGame(storyStep);
        }
      } else {
        this.startGame(storyStep);
      }
    });
    this.root.add(newGameItem);
  }

  protected update(updateArgs: GameUpdateArgs) {
    super.update(updateArgs);
  }

  private startGame(storyStep: StoryStep) {
    if (storyStep === 'intro') {
      this.navigator.push(GameSceneType.Intro);
    } else {
      this.navigator.push(GameSceneType.Level);
    }
  }
}
