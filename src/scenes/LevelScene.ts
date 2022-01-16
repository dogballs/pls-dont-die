import {
  AliveModal,
  Cage,
  CreatureDummy,
  CreatureSelector,
  ControlPanel,
  DeathModal,
  DoctorModal,
  Inventory,
  SimulateButton,
  SummonPanel,
  Summoning,
} from '../objects';
import {
  CreatureType,
  GameState,
  GameStore,
  GameUpdateArgs,
  Selection,
  SimDecider,
  Outcome,
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
  private summoning: Summoning;

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    this.gameState = gameState;
    this.gameStore = gameStore;

    const cage = new Cage();
    cage.position.set(128, 64);
    this.root.add(cage);

    const summonPanel = new SummonPanel(this.params.lastCreature);
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
    const messages: string[][] = [];
    messages.push(['Here is the device assigned to you.']);
    messages.push(["Let's try it out on a dummy first. Go on and summon it!"]);
    this.showDoctorModal(messages);
  }

  private showDoctorDummySimulateToLive() {
    const messages: string[][] = [];
    messages.push(['Voila! Our dummy test subject!']);
    messages.push(['On the right you can see the control panel.']);
    messages.push([
      'It is used to configure the environment for our',
      'test subject.',
    ]);
    messages.push([
      "Let's run a simulation for our dummy with default",
      'parameters!',
    ]);

    this.showDoctorModal(messages);
  }

  private showDoctorDummyLivedAndSummonToDie() {
    const messages: string[][] = [];
    messages.push([
      'Perfect! When the conditions perfectly suit the',
      'creature, we are able to harvest unique elements.',
    ]);
    messages.push([
      "The nuance is that we don't know these perfect",
      'conditions beforehand.',
    ]);
    messages.push([
      'And it is up to you to figure them out by fine',
      'fine tuning the controls.',
    ]);
    messages.push([
      "Let's try summon the dummy again, but this time",
      'selecting non-default parameters for simulation.',
    ]);

    this.showDoctorModal(messages);
  }

  private showDoctorDummyDied() {
    const messages: string[][] = [];
    messages.push([
      'Sweet! If the conditions are not perfect',
      'the simulation is considered failed ...',
    ]);
    messages.push([
      '... but we are still able to extract different kinds',
      'of elements in the event of death.',
    ]);
    messages.push([
      "But don't worry, they ... don't actualy die.",
      "It's just a simulation ... ahem ...",
    ]);
    messages.push([
      '... Well, the onboarding is pretty much done.',
      'You now have access to new creatures.',
    ]);
    messages.push(['Good luck with your simluations!']);

    this.showDoctorModal(messages, () => {
      this.gameStore.setStoryStep('first_act');
      this.gameStore.save();
    });
  }

  private showDoctorDummyShouldNotDefault() {
    const messages: string[][] = [];
    messages.push(["This time let's try selecting non-default parameters."]);

    this.showDoctorModal(messages);
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
