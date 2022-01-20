import { GameObject, Subject, TextPainter } from '../core';
import { CreatureType, GameUpdateArgs } from '../game';

import { Section } from './ui';

import { EssenceSelector } from './EssenceSelector';
import { ModifierSelector } from './ModifierSelector';
import { SummonButton } from './SummonButton';

export class SummonPanel extends GameObject {
  summoned = new Subject<null>();

  constructor(private readonly preselectedCreature: CreatureType) {
    super(266, 270);
  }

  protected setup({ gameStore }: GameUpdateArgs) {
    const section = new Section({
      height: this.size.height,
      width: this.size.width,
      title: 'Reactor',
      titleHeight: 48,
      titleTextSize: 22,
    });
    this.add(section);

    const description = new GameObject(266, 32);
    description.painter = new TextPainter({
      text: 'Select elements to summon a creature',
      color: '#aaa',
      size: 14,
    });
    description.position.set(12, 62);
    this.add(description);

    const essenceSelector = new EssenceSelector(
      gameStore.getLastActiveEssence(),
    );
    essenceSelector.position.set(5, 90);
    this.add(essenceSelector);

    const modifierSelector = new ModifierSelector(
      gameStore.getLastActiveModifier(),
    );
    modifierSelector.position.set(5, 180);
    this.add(modifierSelector);

    const summonButton = new SummonButton();
    summonButton.position.set(0, 300);
    summonButton.clicked.addListener(() => {
      this.summoned.notify(null);
    });
    this.add(summonButton);
  }
}
