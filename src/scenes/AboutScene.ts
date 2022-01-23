import { GameUpdateArgs, StoryStep } from '../game';
import { MainMenuItem, MainMenuOverlay } from '../objects';
import { config } from '../config';
import { GameSceneType } from './GameSceneType';
import { GameScene } from './GameScene';

export class AboutScene extends GameScene {
  protected setup() {
    const overlay = new MainMenuOverlay();
    this.root.add(overlay);

    const backItem = new MainMenuItem('< BACK');
    backItem.position.set(384, 256);
    backItem.clicked.addListener(() => {
      this.navigator.push(GameSceneType.MainMenu);
    });
    this.root.add(backItem);

    const githubItem = new MainMenuItem('GITHUB');
    githubItem.position.set(384, 312);
    githubItem.clicked.addListener(() => {
      window.open(config.GITHUB_LINK);
    });
    this.root.add(githubItem);
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
