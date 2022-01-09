import {
  Cage,
  CreatureDummy,
  CreatureSelector,
  ControlPanel,
  SummonButton,
} from '../objects';
import { GameUpdateArgs } from '../game';

import { GameScene } from './GameScene';

export class LevelScene extends GameScene {
  protected setup({ gameState }: GameUpdateArgs) {
    const cage = new Cage();
    cage.position.set(128, 64);
    this.root.add(cage);

    const creatureSelector = new CreatureSelector();
    creatureSelector.changed.addListener((value) => {
      gameState.setCreature(value);
    });
    creatureSelector.position.set(704, 64);

    const creature = new CreatureDummy();
    creature.position.set(128, 64);
    this.root.add(creature);
    this.root.add(creatureSelector);

    const controlPanel = new ControlPanel();
    controlPanel.position.set(704, 256);
    this.root.add(controlPanel);

    const summonButton = new SummonButton();
    summonButton.position.set(704, 544);
    this.root.add(summonButton);
  }
}
