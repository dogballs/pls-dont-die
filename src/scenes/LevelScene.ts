import { Cage, Creature, CreatureSelector, ControlPanel } from '../objects';
import { GameScene } from './GameScene';

export class LevelScene extends GameScene {
  protected setup() {
    const cage = new Cage();
    cage.position.set(128, 64);
    this.root.add(cage);

    const creatureSelector = new CreatureSelector();
    creatureSelector.position.set(704, 64);

    const creature = new Creature();
    creature.position.set(290, 192);
    this.root.add(creature);
    this.root.add(creatureSelector);

    const controlPanel = new ControlPanel();
    controlPanel.position.set(704, 256);
    this.root.add(controlPanel);
  }
}
