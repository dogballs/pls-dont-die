import { GameObject } from '../core';
import { GameUpdateArgs } from '../game';

import { Inventory } from './Inventory';

export class Sidebar extends GameObject {
  constructor() {
    super(200, 600);
  }

  protected setup({ gameStore }: GameUpdateArgs) {
    // const storyStep = gameStore.getStoryStep();
    // if (storyStep !== 'dummy_summon_live') {
    //   const inventory = new Inventory();
    //   inventory.position.set(0, 64);
    //   this.add(inventory);
    // }
  }
}
