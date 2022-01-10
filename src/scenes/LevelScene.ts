import {
  Cage,
  CreatureDummy,
  CreatureSelector,
  ControlPanel,
  SummonButton,
  Summoning,
} from '../objects';
import { GameUpdateArgs } from '../game';

import { GameScene } from './GameScene';

export class LevelScene extends GameScene {
  private summoning: Summoning;

  protected setup({ gameState }: GameUpdateArgs) {
    const cage = new Cage();
    cage.position.set(128, 64);
    this.root.add(cage);

    const creatureSelector = new CreatureSelector();
    creatureSelector.changed.addListener((value) => {
      gameState.setCreature(value);
    });
    creatureSelector.position.set(704, 64);
    this.root.add(creatureSelector);

    const controlPanel = new ControlPanel();
    controlPanel.position.set(704, 256);
    this.root.add(controlPanel);

    const summonButton = new SummonButton();
    summonButton.position.set(704, 544);
    summonButton.clicked.addListener(this.handleSummonClick);
    this.root.add(summonButton);
  }

  private handleSummonClick = () => {
    this.summoning = new Summoning();
    this.summoning.position.set(128, 64);
    this.summoning.fadeInCompleted.addListener(() => {
      const creature = new CreatureDummy();
      creature.position.set(128, 64);
      this.root.add(creature);
    });
    this.summoning.completed.addListener(() => {
      this.root.remove(this.summoning);
    });
    this.root.add(this.summoning);
  };
}
