import { GameObject, Subject, TextPainter } from '../core';
import { Creature, CreatureType, GameStore, GameUpdateArgs } from '../game';
import { config } from '../config';

import { ResourceItem } from './ResourceItem';
import { Section } from './Section';
import { Selector } from './Selector';

interface CreatureSelectorOptions {
  mode?: 'select' | 'view';
  preselectedCreature?: CreatureType;
}

const DEFAULT_OPTIONS: CreatureSelectorOptions = {
  mode: 'select',
  preselectedCreature: 'dummy',
};

export class CreatureSelector extends GameObject {
  changed = new Subject<string>();

  private options: CreatureSelectorOptions;
  private selectedIndex;
  private arrowLeft: GameObject;
  private arrowRight: GameObject;
  private label: GameObject;
  private resourceItems: GameObject[] = [];
  private gameStore: GameStore;

  constructor(options: CreatureSelectorOptions = {}) {
    super(256, 64);

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    if (!this.options.preselectedCreature) {
      this.options.preselectedCreature = DEFAULT_OPTIONS.preselectedCreature;
    }
    if (this.options.mode === 'select') {
      this.size.setHeight(160);
    }
  }

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    this.gameStore = gameStore;

    const section = new Section({
      width: this.size.width,
      height: this.size.height,
      title: 'Creature',
    });
    this.add(section);

    if (this.options.mode === 'select') {
      const choices = Object.keys(config.CREATURES).map((creatureType) => {
        const creatureConfig = config.CREATURES[creatureType];
        const creature = Creature.fromConfig(creatureConfig);
        const name =
          gameStore.isKnownCreature(creature.type) || creatureType === 'dummy'
            ? creature.name
            : creature.unknownName;

        return {
          label: name,
          value: creature.type,
        };
      });
      const selector = new Selector(choices, {
        defaultValue: this.options.preselectedCreature,
      });
      selector.position.set(0, 36);
      selector.changed.addListener(this.handleSelected);
      this.add(selector);
    } else {
      const creatureConfig = config.CREATURES[gameState.creature];
      const creature = Creature.fromConfig(creatureConfig);

      const title = new GameObject(256, 28);
      title.position.set(0, 32);
      title.painter = new TextPainter({
        text: creature.name,
        color: '#fff',
        size: 24,
        alignment: TextPainter.Alignment.MiddleCenter,
      });
      this.add(title);
    }
  }

  private handleSelected = (creatureType: CreatureType) => {
    for (const item of this.resourceItems) {
      this.remove(item);
    }
    this.resourceItems = [];

    const selectedConfig = config.CREATURES[creatureType];

    for (const [index, req] of selectedConfig.requiredResources.entries()) {
      const resourceItem = new ResourceItem({
        type: req.type,
        amount: this.gameStore.getResourceAmount(req.type),
        requiredAmount: req.amount,
      });
      resourceItem.position.set(16, 78 + 40 * index);
      this.resourceItems.push(resourceItem);
      this.add(resourceItem);
    }

    this.changed.notify(creatureType);
  };
}
