import { GameObject } from '../core';
import { GameUpdateArgs } from '../game';

import { CreatureSelector } from './CreatureSelector';
import { EnvSelector } from './EnvSelector';
// import { LightSelector } from './LightSelector';
import { TempSelector } from './TempSelector';

export class ControlPanel extends GameObject {
  constructor() {
    super(256, 256);
  }

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    const storyStep = gameStore.getStoryStep();
    const isSelectionLocked = storyStep === 'dummy_summon_live';

    const creatureSelector = new CreatureSelector({
      mode: 'view',
      preselectedCreature: gameState.creature,
    });
    this.add(creatureSelector);

    const envSelector = new EnvSelector(isSelectionLocked);
    envSelector.position.set(0, 96);
    envSelector.changed.addListener((value) => {
      gameState.setEnv(value);
    });
    this.add(envSelector);

    const tempSelector = new TempSelector(isSelectionLocked);
    tempSelector.position.set(0, 168);
    tempSelector.changed.addListener((value) => {
      gameState.setTemp(value);
    });
    this.add(tempSelector);

    // const lightSelector = new LightSelector();
    // lightSelector.position.set(0, 194);
    // this.add(lightSelector);
  }
}
