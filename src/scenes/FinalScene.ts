import { GameObject, Rect, SpritePainter, TextPainter } from '../core';
import { GameUpdateArgs } from '../game';
import { Modal, TalkModal } from '../objects';

import { GameSceneType } from './GameSceneType';
import { GameScene } from './GameScene';

const messages: string[][] = [];
messages.push(['BOO!'], ['(you died)']);

export class FinalScene extends GameScene {
  protected setup({ gameStore, spriteLoader }: GameUpdateArgs) {
    const bigSpirit = new GameObject(3000, 3000);
    bigSpirit.painter = new SpritePainter(
      spriteLoader.load('creature.spirit', new Rect(0, 0, 3000, 3000)),
    );
    bigSpirit.position.set(-1100, -800);
    this.root.add(bigSpirit);

    const spiritModal = new TalkModal(messages, 'spirit', 'compact');
    spiritModal.updateMatrix();
    spiritModal.setCenter(this.root.getSelfCenter());
    spiritModal.position.setY(512);
    spiritModal.closed.addListener(() => {
      bigSpirit.removeSelf();
      spiritModal.removeSelf();
      gameStore.setStoryStep('finished');
      gameStore.save();

      const endModal = new Modal({
        title: 'Story complete',
        acceptText: 'Main menu',
      });
      endModal.updateMatrix();
      endModal.setCenter(this.root.getSelfCenter());
      endModal.updateMatrix();
      endModal.closed.addListener(() => {
        this.navigator.push(GameSceneType.MainMenu);
      });

      const endText = new GameObject(128, 32);
      endText.painter = new TextPainter({
        text: 'You can continue the game to discover the rest :)',
        color: '#333',
        alignment: TextPainter.Alignment.MiddleCenter,
      });
      endText.updateMatrix();
      endText.setCenter(endModal.getSelfCenter());
      endText.updateMatrix();
      endModal.add(endText);

      this.root.add(endModal);
    });
    this.root.add(spiritModal);
  }

  protected update(updateArgs: GameUpdateArgs) {
    super.update(updateArgs);
  }
}
