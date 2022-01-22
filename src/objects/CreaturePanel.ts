import { GameObject } from '../core';
import { CreatureType, GameUpdateArgs, SummonHelper } from '../game';

import { Section } from './ui';

import { CreatureSelector } from './CreatureSelector';
import { CreatureDropList } from './CreatureDropList';
import { CreatureRequireList } from './CreatureRequireList';

export class CreaturePanel extends GameObject {
  constructor(private readonly preselectedCreature: CreatureType) {
    super(266, 590);
  }

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    const storyStep = gameStore.getStoryStep();

    const isSelectionDummy =
      storyStep === 'dummy_summon_live' || storyStep === 'dummy_lived';

    const section = new Section({
      height: this.size.height,
      width: this.size.width,
      title: 'Database',
      titleHeight: 48,
      titleTextSize: 22,
    });
    this.add(section);

    const creatureSelector = new CreatureSelector({
      preselectedCreature: this.preselectedCreature,
      mode: isSelectionDummy ? 'locked' : 'select',
    });
    creatureSelector.position.set(5, 20);
    creatureSelector.changed.addListener((value) => {
      gameState.setDatabaseCreature(value);
    });
    this.add(creatureSelector);

    gameState.creatureChanged.addListener((creatureType) => {
      creatureSelector.select(creatureType);
    });

    const handleReactorChange = () => {
      if (!gameState.essence || !gameState.modifier) {
        return;
      }

      const creatureType = SummonHelper.decideCreature(
        gameState.essence,
        gameState.modifier,
      );
      gameState.setDatabaseCreature(creatureType);
      creatureSelector.select(creatureType);
    };

    gameState.essenceChanged.addListener(handleReactorChange);
    gameState.modifierChanged.addListener(handleReactorChange);

    const dropList = new CreatureDropList();
    dropList.position.set(5, 132);
    this.add(dropList);

    const requireList = new CreatureRequireList();
    requireList.position.set(5, 340);
    this.add(requireList);
  }
}
