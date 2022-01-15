import {
  AliveModal,
  Cage,
  CreatureDummy,
  CreatureSelector,
  ControlPanel,
  DeathModal,
  Inventory,
  SimulateButton,
  SummonButton,
  Summoning,
} from '../objects';
import {
  CreatureType,
  GameState,
  GameStore,
  GameUpdateArgs,
  Outcome,
  Selection,
  SimDecider,
} from '../game';

import { GameScene } from './GameScene';
import { GameSceneType } from './GameSceneType';

export class LevelScene extends GameScene<{
  lastCreature?: CreatureType;
}> {
  private gameState: GameState;
  private gameStore: GameStore;

  private controlPanel: ControlPanel;
  private creatureSelector: CreatureSelector;
  private inventory: Inventory;
  private simulateButton: SimulateButton;
  private summonButton: SummonButton;
  private summoning: Summoning;

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    this.gameState = gameState;
    this.gameStore = gameStore;

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

    this.inventory = new Inventory();
    this.inventory.position.set(704, 340);
    this.root.add(this.inventory);

    this.summonButton = new SummonButton();
    this.summonButton.position.set(704, 256);
    this.summonButton.clicked.addListener(this.handleSummonClick);
    this.root.add(this.summonButton);

    // this.handleAlive(new Outcome('alive', [new Resource('dummium', 1)]));
    // this.handleDeath(new Outcome('death', [new Resource('soulium', 1)]));
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
    this.root.remove(this.inventory);
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
    const selection = new Selection({
      creature: this.gameState.creature,
      env: this.gameState.env,
      temp: this.gameState.temp,
    });

    const outcome = SimDecider.decide(selection);

    if (outcome.status === 'alive') {
      this.handleAlive(outcome);
    } else {
      this.handleDeath(outcome);
    }
  };

  private handleAlive = (outcome: Outcome) => {
    const modal = new AliveModal(outcome);
    modal.updateMatrix();
    modal.setCenter(this.root.getSelfCenter());
    modal.closed.addListener(() => {
      this.gameState.resetSelection();
      this.gameStore.addResources(outcome.resources);
      this.gameStore.save();
      this.navigator.replace(GameSceneType.Level, {
        lastCreature: this.gameState.creature,
      });
    });
    this.root.add(modal);
  };

  private handleDeath = (outcome: Outcome) => {
    const modal = new DeathModal(outcome);
    modal.updateMatrix();
    modal.setCenter(this.root.getSelfCenter());
    modal.closed.addListener(() => {
      this.gameState.resetSelection();
      this.gameStore.addResources(outcome.resources);
      this.gameStore.save();
      this.navigator.replace(GameSceneType.Level, {
        lastCreature: this.gameState.creature,
      });
    });
    this.root.add(modal);
  };
}
