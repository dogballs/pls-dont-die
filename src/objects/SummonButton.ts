import { GameObject, Subject } from '../core';
import { GameUpdateArgs, SummonHelper } from '../game';

import { Button } from './ui';

export class SummonButton extends GameObject {
  clicked = new Subject<null>();

  private button: Button;

  constructor() {
    super(176, 48);
  }

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    const resources = gameStore.getResources();

    this.button = new Button('Summon');
    this.add(this.button);

    this.button.clicked.addListener(() => {
      this.clicked.notify(null);
    });

    gameState.essenceChanged.addListener((essence) => {
      // const canSummon = SummonHelper.canSummon(creature, resources);
      // this.button.setDisabled(!canSummon);
    });
    gameState.modifierChanged.addListener((modifier) => {});
  }
}
