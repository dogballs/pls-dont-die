import { GameObject, Subject } from '../core';
import { CreatureType, Resource } from '../game';

import { ResourceItem } from './ResourceItem';
import { Section } from './Section';
import { Selector } from './Selector';

type Config = {
  type: CreatureType;
  text: string;
  unknownText: string;
  requiredResources: Resource[];
};

const configs: Config[] = [
  {
    type: 'dummy',
    text: 'Dummy',
    unknownText: 'Dummy',
    requiredResources: [],
  },
  {
    type: 'fish',
    unknownText: 'Unknown 1',
    text: 'Fish',
    requiredResources: [new Resource('soulium', 1), new Resource('dummium', 1)],
  },
];

interface CreatureSelectorOptions {
  preselectedCreature?: CreatureType;
}

const DEFAULT_OPTIONS: CreatureSelectorOptions = {
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

  constructor(options: CreatureSelectorOptions = {}) {
    super(256, 160);

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    if (!this.options.preselectedCreature) {
      this.options.preselectedCreature = DEFAULT_OPTIONS.preselectedCreature;
    }
  }

  protected setup() {
    const section = new Section({
      width: this.size.width,
      height: this.size.height,
      title: 'Creature',
    });
    this.add(section);

    const choices = configs.map((config) => ({
      label: config.text,
      value: config.type,
    }));
    const selector = new Selector(choices, {
      defaultValue: this.options.preselectedCreature,
    });
    selector.position.set(0, 36);
    selector.changed.addListener(this.handleSelected);
    this.add(selector);
  }

  private handleSelected = (creatureType: CreatureType) => {
    for (const item of this.resourceItems) {
      this.remove(item);
    }
    this.resourceItems = [];

    const selectedConfig = configs.find(
      (config) => config.type === creatureType,
    );

    for (const [index, req] of selectedConfig.requiredResources.entries()) {
      // TODO: add current amount
      const resourceItem = new ResourceItem({
        type: req.type,
        amount: 0,
        requiredAmount: req.amount,
      });
      resourceItem.position.set(16, 78 + 40 * index);
      this.resourceItems.push(resourceItem);
      this.add(resourceItem);
    }

    this.changed.notify(creatureType);
  };
}
