import { GameObject } from '../core';
import { GameUpdateArgs, ReqCheck } from '../game';

import { Button } from './Button';

export class SummonButton extends GameObject {
  private button: Button;

  constructor() {
    super(176, 48);
  }

  protected setup({ gameState }: GameUpdateArgs) {
    this.button = new Button('Summon');
    this.add(this.button);

    gameState.creatureChanged.addListener((creature) => {
      const canSummon = ReqCheck.canSummon(creature);
      this.button.setDisabled(!canSummon);
    });
  }
}
