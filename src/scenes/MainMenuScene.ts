import { GameObject, SpritePainter, TextPainter } from '../core';
import { GameUpdateArgs, StoryStep } from '../game';
import { ConfirmModal, MainMenuItem } from '../objects';
import { config } from '../config';
import { GameSceneType } from './GameSceneType';
import { GameScene } from './GameScene';

export class MainMenuScene extends GameScene {
  protected setup({ gameStore, spriteLoader }: GameUpdateArgs) {
    const canContinue = gameStore.hasSavedGame();
    const title = new GameObject(512, 128);
    title.position.set(256, 64);
    title.painter = new SpritePainter(spriteLoader.load('main.title.1'));
    this.root.add(title);

    const version = new GameObject(128, 32);
    version.painter = new TextPainter({
      text: `Version ${config.VERSION}`,
      color: '#999',
      alignment: TextPainter.Alignment.MiddleCenter,
      size: 14,
    });
    version.position.set(870, 720);
    this.root.add(version);

    // const disclaimer = new GameObject(512, 32);
    // disclaimer.painter = new TextPainter({
    //   text: '* Game is played with a mouse',
    //   color: '#999',
    //   alignment: TextPainter.Alignment.MiddleCenter,
    // });
    // disclaimer.updateMatrix();
    // disclaimer.setCenter(this.root.getSelfCenter());
    // disclaimer.position.setY(512);
    // this.root.add(disclaimer);

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
