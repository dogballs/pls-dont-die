import {
  AliveModal,
  Cage,
  CreatureDummy,
  CreatureSelector,
  ControlPanel,
  SimulateButton,
  SummonButton,
  Summoning,
} from '../objects';
import { CreatureType, GameState, GameUpdateArgs, SimDecider } from '../game';

import { GameScene } from './GameScene';
import { GameSceneType } from './GameSceneType';

export class LevelScene extends GameScene<{
  lastCreature?: CreatureType;
}> {
  private gameState: GameState;

  private controlPanel: ControlPanel;
  private creatureSelector: CreatureSelector;
  private simulateButton: SimulateButton;
  private summonButton: SummonButton;
  private summoning: Summoning;

  protected setup({ gameState }: GameUpdateArgs) {
    this.gameState = gameState;

    const cage = new Cage();
    cage.position.set(128, 64);
    this.root.add(cage);

    this.creatureSelector = new CreatureSelector({
      preselectedCreature: this.params.lastCreature,
    });
    this.creatureSelector.changed.addListener((value) => {
      gameState.setCreature(value);
    });
    this.creatureSelector.position.set(704, 64);
    this.root.add(this.creatureSelector);

    this.summonButton = new SummonButton();
    this.summonButton.position.set(704, 256);
    this.summonButton.clicked.addListener(this.handleSummonClick);
    this.root.add(this.summonButton);
  }

  private summon() {
    // TODO: spend resources

    let creature;
    switch (this.gameState.creature) {
      case 'dummy':
        creature = new CreatureDummy();
        break;
      default:
        throw new Error(
          `Summoning unknown creature "${this.gameState.creature}"`,
        );
    }

    creature.position.set(128, 64);
    this.root.add(creature);
  }

  private handleSummonClick = () => {
    this.root.remove(this.creatureSelector);
    this.root.remove(this.summonButton);

    this.summoning = new Summoning();
    this.summoning.position.set(128, 64);
    this.summoning.fadeInCompleted.addListener(() => {
      this.summon();
    });
    this.summoning.completed.addListener(this.handleSummoned);
    this.root.add(this.summoning);
  };

  private handleSummoned = () => {
    this.root.remove(this.summoning);

    this.controlPanel = new ControlPanel();
    this.controlPanel.position.set(704, 64);
    this.root.add(this.controlPanel);

    this.simulateButton = new SimulateButton();
    this.simulateButton.position.set(704, 384);
    this.simulateButton.clicked.addListener(this.handleSimulated);
    this.root.add(this.simulateButton);
  };

  private handleSimulated = () => {
    const outcome = SimDecider.decide(this.gameState.creature, {
      env: this.gameState.env,
      temp: this.gameState.temp,
    });

    if (outcome.status === 'alive') {
      this.handleAlive(outcome);
      return;
    }

    console.log('simulated', outcome);
    throw new Error('Unsimulated');
  };

  private handleAlive = (outcome) => {
    const modal = new AliveModal(outcome);
    modal.updateMatrix();
    modal.setCenter(this.root.getSelfCenter());
    modal.closed.addListener(() => {
      this.navigator.replace(GameSceneType.Level, {
        lastCreature: this.gameState.creature,
      });
    });
    this.root.add(modal);
  };
}
