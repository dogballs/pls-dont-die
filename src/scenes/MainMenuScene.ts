import { TextPainter } from '../core';
import { GameUpdateArgs, StoryStep } from '../game';
import { ConfirmModal, MainMenuItem, MainMenuOverlay } from '../objects';
import { GameSceneType } from './GameSceneType';
import { GameScene } from './GameScene';

export class MainMenuScene extends GameScene {
  protected setup({ gameStore }: GameUpdateArgs) {
    const canContinue = gameStore.hasSavedGame();

    const overlay = new MainMenuOverlay();
    this.root.add(overlay);

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
        this.startGame(gameStore.getStoryStep());
      });
      this.root.add(continueGameItem);
    }

    const continueAddHeight = canContinue ? 56 : 0;

    const newGameItem = new MainMenuItem('NEW GAME');
    newGameItem.position.set(384, 256 + continueAddHeight);
    newGameItem.clicked.addListener(() => {
      if (canContinue) {
        const modal = new ConfirmModal({});
        modal.updateMatrix();
        modal.setCenter(this.root.getSelfCenter());
        modal.updateMatrix();
        modal.accepted.addListener(() => {
          gameStore.reset();
          gameStore.save();
          this.startGame(gameStore.getStoryStep());
        });
        modal.declined.addListener(() => {
          modal.removeSelf();
        });
        this.root.add(modal);
      } else {
        this.startGame(gameStore.getStoryStep());
      }
    });
    this.root.add(newGameItem);

    const aboutItem = new MainMenuItem('ABOUT');
    aboutItem.position.set(384, 312 + continueAddHeight);
    aboutItem.clicked.addListener(() => {
      this.navigator.push(GameSceneType.About);
    });
    this.root.add(aboutItem);
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
