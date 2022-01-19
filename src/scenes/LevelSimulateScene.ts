import {
  AliveModal,
  Cage,
  CreatureObject,
  CreatureSelector,
  ControlPanel,
  DeathModal,
  DoctorModal,
  IconTextButton,
  Inventory,
  Sidebar,
  Simulation,
  SummonPanel,
  Summoning,
} from '../objects';
import {
  DoctorLines,
  GameState,
  GameStore,
  GameUpdateArgs,
  Outcome,
  Resource,
  Selection,
  SimDecider,
} from '../game';

import { GameScene } from './GameScene';
import { GameSceneType } from './GameSceneType';

export class LevelSimulateScene extends GameScene {
  private gameState: GameState;
  private gameStore: GameStore;

  private controlPanel: ControlPanel;
  private creatureSelector: CreatureSelector;
  private inventory: Inventory;

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    this.gameState = gameState;
    this.gameStore = gameStore;

    const storyStep = gameStore.getStoryStep();

    const cage = new Cage();
    cage.position.set(230, 64);
    this.root.add(cage);

    const sidebar = new Sidebar();
    sidebar.position.set(0, 0);
    this.root.add(sidebar);

    const summonPanel = new SummonPanel(gameStore.getLastActiveCreature());
    summonPanel.position.set(766, 64);
    summonPanel.summoned.addListener(() => {
      summonPanel.removeSelf();
      this.handleSummonClick();
    });
    this.root.add(summonPanel);

    if (storyStep !== 'dummy_summon_live') {
      this.inventory = new Inventory();
      this.inventory.position.set(0, 64);
      this.root.add(this.inventory);
    }

    if (storyStep === 'dummy_summon_live') {
      this.showDoctorDummySummonToLive();
    } else if (storyStep === 'dummy_lived') {
      this.showDoctorDummyLivedAndSummonToDie();
    } else if (storyStep === 'dummy_died') {
      this.showDoctorDummyDied();
    }

    // this.handleAlive(
    //   new Outcome('alive', 'none', Selection.createFake(), [
    //     new Resource({ type: 'dummium', amount: 1 }),
    //   ]),
    // );
    // this.handleDeath(
    //   new Outcome('death', 'dummy_not_neutral', Selection.createFake(), [
    //     new Resource({ type: 'soulium', amount: 1 }),
    //   ]),
    // );
  }

  private summon() {
    const creatureObject = new CreatureObject(this.gameState.creature);

    this.gameStore.setCreatureKnown(this.gameState.creature);
    this.gameStore.save();

    creatureObject.position.set(230, 64);
    this.root.add(creatureObject);
  }

  private handleSummonClick = () => {
    this.root.remove(this.inventory);

    const summoning = new Summoning();
    summoning.position.set(230, 64);
    summoning.fadeInCompleted.addListener(() => {
      this.summon();
    });
    summoning.completed.addListener(() => {
      summoning.removeSelf();
      this.handleSummoned();
    });
    this.root.add(summoning);
  };

  private handleSummoned = () => {
    this.gameStore.setLastActiveCreature(this.gameState.creature);
    this.gameStore.save();

    const backButton = new IconTextButton({
      iconType: 'arrow.left',
      text: 'Back to summon',
      activeTextColor: '#489880',
      hoverTextColor: '#84d74b',
    });
    backButton.position.set(0, 64);
    backButton.clicked.addListenerOnce(() => {
      this.navigator.replace(GameSceneType.Level);
    });
    this.root.add(backButton);

    this.controlPanel = new ControlPanel();
    this.controlPanel.position.set(766, 64);
    this.controlPanel.simulated.addListener(() => {
      this.simulate();
    });
    this.root.add(this.controlPanel);

    if (this.gameStore.getStoryStep() === 'dummy_summon_live') {
      this.showDoctorDummySimulateToLive();
    }
  };

  private simulate() {
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

    this.controlPanel.setDisabled();

    const simulation = new Simulation();
    simulation.position.set(230, 64);
    simulation.completed.addListener(() => {
      simulation.removeSelf();
      this.handleSimulated(selection);
    });
    this.root.add(simulation);
  }

  private handleSimulated = (selection: Selection) => {
    // const creatureConfig = config.CREATURES[selection.creature];
    // const creature = Creature.fromConfig(creatureConfig);
    // this.gameStore.removeResources(creature.requiredResources);

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
    modal.updateMatrix();
    modal.closed.addListener(() => {
      this.gameState.resetSelection();
      this.gameStore.addResources(outcome.resources);
      this.gameStore.addKnownResourcesForCreature(
        outcome.selection.creature,
        outcome.resources,
      );
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
    modal.updateMatrix();
    modal.closed.addListener(() => {
      this.gameState.resetSelection();
      this.gameStore.addResources(outcome.resources);
      this.gameStore.addKnownResourcesForCreature(
        outcome.selection.creature,
        outcome.resources,
      );
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
