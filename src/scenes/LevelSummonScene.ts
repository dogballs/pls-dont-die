import {
  AliveModal,
  Cage,
  CreatureObject,
  CreaturePanel,
  CreatureSelector,
  ControlPanel,
  DeathModal,
  DoctorModal,
  IconTextButton,
  Inventory,
  Simulation,
  SpiritResources,
  SummonPanel,
  Summoning,
} from '../objects';
import {
  Creature,
  DoctorLines,
  GameState,
  GameStore,
  GameUpdateArgs,
  Outcome,
  Selection,
  SimDecider,
  SummonHelper,
} from '../game';
import { config } from '../config';

import { GameScene } from './GameScene';
import { GameSceneType } from './GameSceneType';

export class LevelSummonScene extends GameScene {
  private gameState: GameState;
  private gameStore: GameStore;

  private controlPanel: ControlPanel;
  private creatureSelector: CreatureSelector;
  private inventory: Inventory;
  private spiritResources: SpiritResources;

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    this.gameState = gameState;
    this.gameStore = gameStore;

    const storyStep = gameStore.getStoryStep();

    const cage = new Cage();
    cage.position.set(256, 64);
    this.root.add(cage);

    const creaturePanel = new CreaturePanel(gameStore.getLastActiveCreature());
    creaturePanel.position.set(0, 64);
    this.root.add(creaturePanel);

    // const inventory = new Inventory();
    // inventory.position.set(700, 500);
    // this.root.add(inventory);

    const summonPanel = new SummonPanel(gameStore.getLastActiveCreature());
    summonPanel.position.set(756, 64);
    summonPanel.summoned.addListener(() => {
      summonPanel.removeSelf();
      this.handleSummonClick();
    });
    this.root.add(summonPanel);

    if (storyStep === 'dummy_summon_live') {
      this.showDoctorDummySummonToLive();
    } else if (storyStep === 'dummy_lived') {
      this.showDoctorDummyLivedAndSummonToDie();
    } else if (storyStep === 'dummy_died') {
      this.showDoctorDummyDied();
    }
  }

  private summon() {
    const creatureType = SummonHelper.decideCreature(
      this.gameState.essence,
      this.gameState.modifier,
    );

    this.gameState.setDatabaseCreature(creatureType);
    this.gameState.setCreature(creatureType);
    this.gameStore.setCreatureKnown(creatureType);
    this.gameStore.addKnownReqPairForCreature(
      creatureType,
      this.gameState.essence,
      this.gameState.modifier,
    );
    this.gameStore.save();

    const creatureObject = new CreatureObject(creatureType);
    creatureObject.position.set(256, 64);
    this.root.add(creatureObject);

    if (creatureType === 'spirit') {
      this.spiritResources = new SpiritResources();
      this.spiritResources.position.set(450, 150);
      this.root.add(this.spiritResources);
    }
  }

  private handleSummonClick = () => {
    // this.root.remove(this.inventory);

    const summoning = new Summoning();
    summoning.position.set(256, 64);
    summoning.fadeInCompleted.addListener(() => {
      this.summon();
    });
    summoning.completed.addListener(() => {
      this.handleSummoned();
    });
    this.root.add(summoning);
  };

  private handleSummoned = () => {
    this.gameStore.setLastActiveEssence(this.gameState.essence);
    this.gameStore.setLastActiveModifier(this.gameState.modifier);
    this.gameStore.setLastActiveCreature(this.gameState.creature);
    this.gameStore.save();

    const backButton = new IconTextButton({
      iconType: 'arrow.left',
      text: 'Back to summon',
      activeTextColor: '#489880',
      hoverTextColor: '#84d74b',
    });
    backButton.position.set(760, 74);
    backButton.clicked.addListenerOnce(() => {
      this.root.remove(this.spiritResources);
      this.navigator.replace(GameSceneType.LevelSummon);
    });
    this.root.add(backButton);

    this.controlPanel = new ControlPanel();
    this.controlPanel.position.set(756, 64);
    this.controlPanel.simulated.addListener(() => {
      this.root.remove(this.spiritResources);
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
    simulation.position.set(256, 64);
    simulation.completed.addListener(() => {
      simulation.removeSelf();
      this.handleSimulated(selection);
    });
    this.root.add(simulation);
  }

  private handleSimulated = (selection: Selection) => {
    const creatureConfig = config.CREATURES[selection.creature];
    const creature = Creature.fromConfig(creatureConfig);

    // this.gameStore.removeResources(creature.requiredResources);

    const outcome = SimDecider.decide(selection);
    if (outcome.status === 'alive') {
      this.handleAlive(outcome);
    } else {
      this.handleDeath(outcome);
    }
  };

  private handleAlive = (outcome: Outcome) => {
    this.gameStore.addKnownResources(outcome.resources);
    this.gameStore.addKnownDropsForCreature(
      outcome.selection.creature,
      outcome.resources,
    );

    const modal = new AliveModal(outcome);
    modal.updateMatrix();
    modal.setCenter(this.root.getSelfCenter());
    modal.updateMatrix();
    modal.closed.addListener(() => {
      this.gameState.resetSelection();
      this.gameStore.addResources(outcome.resources);
      if (this.gameStore.getStoryStep() === 'dummy_summon_live') {
        this.gameStore.setStoryStep('dummy_lived');
      }
      this.gameStore.save();
      this.navigator.replace(GameSceneType.LevelSummon);
    });
    this.root.add(modal);
  };

  private handleDeath = (outcome: Outcome) => {
    this.gameStore.addKnownResources(outcome.resources);
    this.gameStore.addKnownDropsForCreature(
      outcome.selection.creature,
      outcome.resources,
    );

    const modal = new DeathModal(outcome);
    modal.updateMatrix();
    modal.setCenter(this.root.getSelfCenter());
    modal.updateMatrix();
    modal.closed.addListener(() => {
      this.gameState.resetSelection();
      this.gameStore.addResources(outcome.resources);

      if (this.gameStore.getStoryStep() === 'dummy_lived') {
        this.gameStore.setStoryStep('dummy_died');
      }
      this.gameStore.save();
      this.navigator.replace(GameSceneType.LevelSummon);
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
