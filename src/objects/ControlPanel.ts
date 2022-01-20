import { GameObject, Subject } from '../core';
import { GameUpdateArgs } from '../game';

import { CreatureSelector } from './CreatureSelector';
import { EnvSelector } from './EnvSelector';
// import { LightSelector } from './LightSelector';
import { SimulateButton } from './SimulateButton';
import { TempSelector } from './TempSelector';

export class ControlPanel extends GameObject {
  simulated = new Subject<null>();

  private simulateButton: SimulateButton;
  private envSelector: EnvSelector;
  private tempSelector: TempSelector;

  constructor() {
    super(266, 256);
  }

  setDisabled(disabled) {
    this.simulateButton.setDisabled(disabled);
    this.envSelector.setDisabled(disabled);
    this.tempSelector.setDisabled(disabled);
  }

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    const storyStep = gameStore.getStoryStep();
    const isSelectionLocked = storyStep === 'dummy_summon_live';

    // const creatureSelector = new CreatureSelector({
    //   mode: 'view',
    //   preselectedCreature: gameState.creature,
    // });
    // this.add(creatureSelector);

    this.envSelector = new EnvSelector(isSelectionLocked);
    this.envSelector.position.set(0, 96);
    this.envSelector.changed.addListener((value) => {
      gameState.setEnv(value);
    });
    this.add(this.envSelector);

    this.tempSelector = new TempSelector(isSelectionLocked);
    this.tempSelector.position.set(0, 168);
    this.tempSelector.changed.addListener((value) => {
      gameState.setTemp(value);
    });
    this.add(this.tempSelector);

    this.simulateButton = new SimulateButton();
    this.simulateButton.position.set(0, 320);
    this.simulateButton.clicked.addListener(() => {
      this.simulated.notify(null);
    });
    this.add(this.simulateButton);

    // const lightSelector = new LightSelector();
    // lightSelector.position.set(0, 194);
    // this.add(lightSelector);
  }
}
