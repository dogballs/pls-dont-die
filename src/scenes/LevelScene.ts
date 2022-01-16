import {
  AliveModal,
  Cage,
  CreatureSelector,
  ControlPanel,
  Dummy,
  DeathModal,
  DoctorModal,
  Fish,
  Inventory,
  SimulateButton,
  SummonPanel,
  Summoning,
} from '../objects';
import {
  Creature,
  CreatureType,
  DoctorLines,
  GameState,
  GameStore,
  GameUpdateArgs,
  Selection,
  SimDecider,
  Outcome,
} from '../game';
import { config } from '../config';

import { GameScene } from './GameScene';
import { GameSceneType } from './GameSceneType';

export class LevelScene extends GameScene {
  private gameState: GameState;
  private gameStore: GameStore;

  private controlPanel: ControlPanel;
  private creatureSelector: CreatureSelector;
  private inventory: Inventory;
  private simulateButton: SimulateButton;
  private summoning: Summoning;

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    this.gameState = gameState;
    this.gameStore = gameStore;

    const cage = new Cage();
    cage.position.set(128, 64);
    this.root.add(cage);

    const summonPanel = new SummonPanel(gameStore.getLastSimulatedCreature());
    summonPanel.position.set(704, 64);
    summonPanel.summoned.addListener(() => {
      summonPanel.removeSelf();
      this.handleSummonClick();
    });
    this.root.add(summonPanel);

    const storyStep = gameStore.getStoryStep();
    if (storyStep === 'dummy_summon_live') {
      this.showDoctorDummySummonToLive();
    } else if (storyStep === 'dummy_lived') {
      this.showDoctorDummyLivedAndSummonToDie();
    } else if (storyStep === 'dummy_died') {
      this.showDoctorDummyDied();
    }

    // this.handleAlive(
    //   new Outcome('alive', 'none', Selection.createFake(), [
    //     new Resource('dummium', 1),
    //   ]),
    // );
    // this.handleDeath(
    //   new Outcome('death', 'dummy_not_neutral', Selection.createFake(), [
    //     new Resource('soulium', 1),
    //   ]),
    // );
  }

  private summon() {
    let creature;
    switch (this.gameState.creature) {
      case 'dummy':
        creature = new Dummy();
        break;
      case 'fish':
        creature = new Fish();
        break;
      default:
        throw new Error(
          `Summoning unknown creature "${this.gameState.creature}"`,
        );
    }

    this.gameStore.setCreatureKnown(this.gameState.creature);
    this.gameStore.save();

    creature.position.set(128, 64);
    this.root.add(creature);
  }

  private handleSummonClick = () => {
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

    if (this.gameStore.getStoryStep() === 'dummy_summon_live') {
      this.showDoctorDummySimulateToLive();
    }
  };

  private handleSimulated = () => {
    const selection = new Selection({
      creature: this.gameState.creature,
      env: this.gameState.env,
      temp: this.gameState.temp,
    });

    if (this.gameStore.getStoryStep() === 'dummy_lived') {
      if (selection.isDefault()) {
        this.showDoctorDummyShouldNotDefault();
        return;
      }
    }

    const creatureConfig = config.CREATURES[selection.creature];
    const creature = Creature.fromConfig(creatureConfig);

    this.gameStore.setLastSimulatedCreature(creature.type);
    this.gameStore.removeResources(creature.requiredResources);
    this.gameStore.save();

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
      if (this.gameStore.getStoryStep() === 'dummy_summon_live') {
        this.gameStore.setStoryStep('dummy_lived');
      }
      this.gameStore.save();
      this.navigator.replace(GameSceneType.Level);
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
      if (this.gameStore.getStoryStep() === 'dummy_lived') {
        this.gameStore.setStoryStep('dummy_died');
      }
      this.gameStore.save();
      this.navigator.replace(GameSceneType.Level, {
        lastCreature: this.gameState.creature,
      });
    });
    this.root.add(modal);
  };

  private showDoctorDummySummonToLive() {
    this.showDoctorModal(DoctorLines.dummySummonToLive());
  }

  private showDoctorDummySimulateToLive() {
    this.showDoctorModal(DoctorLines.dummySimulateToLive());
  }

  private showDoctorDummyLivedAndSummonToDie() {
    this.showDoctorModal(DoctorLines.dummyLivedAndSummonToDie());
  }

  private showDoctorDummyDied() {
    this.showDoctorModal(DoctorLines.dummyDied(), () => {
      this.gameStore.setStoryStep('first_act');
      this.gameStore.save();
    });
  }

  private showDoctorDummyShouldNotDefault() {
    this.showDoctorModal(DoctorLines.dummyShouldNotDefault());
  }

  private showDoctorModal(messages: string[][], onClose?: () => void) {
    const doctorModal = new DoctorModal(messages, 'compact');
    doctorModal.updateMatrix();
    doctorModal.setCenter(this.root.getSelfCenter());
    doctorModal.position.setY(512);
    doctorModal.closed.addListener(() => {
      onClose?.();
    });
    this.root.add(doctorModal);
  }
}
