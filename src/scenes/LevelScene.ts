import {
  AliveModal,
  Cage,
  CreatureObject,
  CreaturePanel,
  CreatureSelector,
  ControlPanel,
  DeathModal,
  TalkModal,
  IconTextButton,
  Inventory,
  Simulation,
  SpiritResources,
  SummonPanel,
  Summoning,
} from '../objects';
import {
  Creature,
  TalkLines,
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

export class LevelScene extends GameScene {
  private gameState: GameState;
  private gameStore: GameStore;

  private backButton: IconTextButton;
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

    if (
      !['dummy_summon_live', 'dummy_lived', 'dummy_died'].includes(storyStep)
    ) {
      const creaturePanel = new CreaturePanel(
        gameStore.getLastActiveCreature(),
      );
      creaturePanel.position.set(0, 64);
      this.root.add(creaturePanel);
    }

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
      const storyStep = this.gameStore.getStoryStep();
      if (storyStep === 'spirit_fourth_encounter') {
        this.spiritResources = new SpiritResources();
        this.spiritResources.position.set(450, 150);
        this.root.add(this.spiritResources);
        this.showTalkModal('spirit', TalkLines.spiritFourth());
      }

      this.showSpiritEncounter();
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

    const storyStep = this.gameStore.getStoryStep();

    if (!['dummy_summon_live', 'dummy_lived'].includes(storyStep)) {
      this.backButton = new IconTextButton({
        iconType: 'arrow.left',
        text: 'Back to summon',
        activeTextColor: '#489880',
        hoverTextColor: '#84d74b',
      });
      this.backButton.position.set(760, 74);
      this.backButton.clicked.addListenerOnce(() => {
        this.gameState.resetSelection();
        this.root.remove(this.spiritResources);
        this.navigator.replace(GameSceneType.Level);
      });
      this.root.add(this.backButton);
    }

    this.controlPanel = new ControlPanel();
    this.controlPanel.position.set(756, 64);
    this.controlPanel.simulated.addListener(() => {
      if (!this.showSpiritEncounter()) {
        return;
      }

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
    this.controlPanel.setDisabled(true);
    this.backButton.setDisabled(true);

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
    modal.accepted.addListener(() => {
      this.gameState.resetSelection();
      this.gameStore.addResources(outcome.resources);
      if (this.gameStore.getStoryStep() === 'dummy_summon_live') {
        this.gameStore.setStoryStep('dummy_lived');
      }
      this.gameStore.save();
      this.navigator.replace(GameSceneType.Level);
    });
    modal.backed.addListener(() => {
      this.gameState.resetSelection();
      this.gameStore.addResources(outcome.resources);
      this.gameStore.save();
      this.navigator.replace(GameSceneType.Level);
    });
    modal.retried.addListener(() => {
      this.controlPanel.setDisabled(false);
      this.backButton.setDisabled(false);
      this.gameStore.addResources(outcome.resources);
      this.gameStore.save();
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
    modal.accepted.addListener(() => {
      this.gameState.resetSelection();
      this.gameStore.addResources(outcome.resources);
      if (this.gameStore.getStoryStep() === 'dummy_lived') {
        this.gameStore.setStoryStep('dummy_died');
      }
      this.gameStore.save();
      this.navigator.replace(GameSceneType.Level);
    });
    modal.backed.addListener(() => {
      this.gameState.resetSelection();
      this.gameStore.addResources(outcome.resources);
      this.gameStore.save();
      this.navigator.replace(GameSceneType.Level);
    });
    modal.retried.addListener(() => {
      this.controlPanel.setDisabled(false);
      this.backButton.setDisabled(false);
      this.gameStore.addResources(outcome.resources);
      this.gameStore.save();
    });

    this.root.add(modal);
  };

  private showDoctorDummySummonToLive() {
    this.showTalkModal('doctor', TalkLines.dummySummonToLive());
  }

  private showDoctorDummySimulateToLive() {
    this.showTalkModal('doctor', TalkLines.dummySimulateToLive());
  }

  private showDoctorDummyLivedAndSummonToDie() {
    this.showTalkModal('doctor', TalkLines.dummyLivedAndSummonToDie());
  }

  private showDoctorDummyDied() {
    this.showTalkModal('doctor', TalkLines.dummyDied(), () => {
      this.gameStore.setStoryStep('spirit_first_encounter');
      this.gameStore.save();
      this.navigator.push(GameSceneType.Level);
    });
  }

  private showDoctorDummyShouldNotDefault() {
    this.showTalkModal('doctor', TalkLines.dummyShouldNotDefault());
  }

  private showSpiritEncounter() {
    if (this.gameState.creature !== 'spirit') {
      return true;
    }

    const storyStep = this.gameStore.getStoryStep();

    if (storyStep === 'spirit_first_encounter') {
      this.showTalkModal('spirit', TalkLines.spiritFirst(), () => {
        this.gameStore.setStoryStep('spirit_second_encounter');
        this.gameStore.save();
      });
      return false;
    } else if (storyStep === 'spirit_second_encounter') {
      this.showTalkModal('spirit', TalkLines.spiritSecond(), () => {
        this.gameStore.setStoryStep('spirit_third_encounter');
        this.gameStore.save();
      });
      return false;
    } else if (storyStep === 'spirit_third_encounter') {
      this.showTalkModal('spirit', TalkLines.spiritThird(), () => {
        this.gameStore.setStoryStep('spirit_fourth_encounter');
        this.gameStore.save();
      });
      return false;
    }
    return true;
  }

  private showTalkModal(
    avatar: 'doctor' | 'spirit',
    messages: string[][],
    onClose?: () => void,
  ) {
    const doctorModal = new TalkModal(messages, avatar, 'compact');
    doctorModal.updateMatrix();
    doctorModal.setCenter(this.root.getSelfCenter());
    doctorModal.position.setY(512);
    doctorModal.closed.addListener(() => {
      onClose?.();
    });
    this.root.add(doctorModal);
  }
}
