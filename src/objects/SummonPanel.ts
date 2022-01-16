import { GameObject, Subject } from '../core';
import { CreatureType, GameUpdateArgs } from '../game';

import { CreatureSelector } from './CreatureSelector';
import { Inventory } from './Inventory';
import { SummonButton } from './SummonButton';

export class SummonPanel extends GameObject {
  summoned = new Subject<null>();

  constructor(private readonly preselectedCreature: CreatureType) {
    super(256, 256);
  }

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    const storyStep = gameStore.getStoryStep();

    const isSelectionDummy =
      storyStep === 'dummy_summon_live' || storyStep === 'dummy_lived';

    const creatureSelector = new CreatureSelector({
      preselectedCreature: this.preselectedCreature,
      mode: isSelectionDummy ? 'locked' : 'select',
    });
    creatureSelector.changed.addListener((value) => {
      gameState.setCreature(value);
    });
    this.add(creatureSelector);

    const summonButton = new SummonButton();
    summonButton.position.set(0, 192);
    summonButton.clicked.addListener(() => {
      this.summoned.notify(null);
    });
    this.add(summonButton);

    if (storyStep !== 'dummy_summon_live') {
      const inventory = new Inventory();
      inventory.position.set(0, 276);
      this.add(inventory);
    }
  }
}
