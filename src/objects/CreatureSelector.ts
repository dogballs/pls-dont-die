import { GameObject, Subject, TextPainter } from '../core';
import {
  Creature,
  CreatureType,
  GameStore,
  GameUpdateArgs,
  Resource,
  ResourceType,
} from '../game';
import { config } from '../config';

import { ResourceList } from './ResourceList';
import { Section, Selector } from './ui';

interface CreatureSelectorOptions {
  mode?: 'select' | 'view' | 'locked';
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
  private description: GameObject;
  private requiredDescription: GameObject;
  private label: GameObject;
  private requiredResourceList: GameObject;
  private requiredSection: GameObject;
  private droppedResourceList: GameObject;
  private gameStore: GameStore;

  constructor(options: CreatureSelectorOptions = {}) {
    super(256, 64);

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    if (!this.options.preselectedCreature) {
      this.options.preselectedCreature = DEFAULT_OPTIONS.preselectedCreature;
    }
    if (this.options.mode === 'select' || this.options.mode === 'locked') {
      this.size.setHeight(100);
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

    if (this.options.mode === 'select' || this.options.mode === 'locked') {
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
        locked: this.options.mode === 'locked',
      });
      selector.position.set(0, 36);
      selector.changed.addListener(this.handleSelected);
      this.add(selector);

      this.description = new GameObject(256, 24);
      this.description.painter = new TextPainter({
        text: 'Undiscovered creature',
        color: '#aaa',
        size: 14,
        alignment: TextPainter.Alignment.MiddleCenter,
      });
      this.description.position.set(0, 70);
      this.add(this.description);

      const dropSection = new Section({
        title: 'Drops elements',
        height: 128,
      });
      dropSection.position.set(0, 118);
      this.add(dropSection);
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
    const creatureConfig = config.CREATURES[creatureType];
    const creature = Creature.fromConfig(creatureConfig);

    const requiredResources = creatureConfig.requiredResources.map(
      (resourceConfig) => {
        return new Resource({
          type: resourceConfig.type,
          amount: this.gameStore.getResourceAmount(resourceConfig.type),
        });
      },
    );

    const droppedResources = creature.droppedResources.map((resource) => {
      return new Resource({
        type: this.gameStore.isKnownResourceForCreature(
          creatureType,
          resource.type,
        )
          ? resource.type
          : ('unknown' as ResourceType),
        amount: 1,
      });
    });

    this.remove(this.requiredResourceList);
    this.remove(this.requiredSection);
    this.remove(this.requiredDescription);
    this.remove(this.droppedResourceList);

    if (requiredResources.length > 0) {
      this.requiredSection = new Section({
        title: 'Required for summon',
        height: 128,
      });
      this.requiredSection.position.set(0, 496);
      this.add(this.requiredSection);

      this.requiredResourceList = new ResourceList(requiredResources, {
        getRequiredAmount: () => 1,
      });
      this.requiredResourceList.position.set(16, 538);
      this.add(this.requiredResourceList);
    }

    if (droppedResources.length > 0) {
      this.droppedResourceList = new ResourceList(droppedResources);
      this.droppedResourceList.position.set(16, 158);
      this.add(this.droppedResourceList);
    }

    (this.description.painter as TextPainter).setOptions({
      text: this.gameStore.isKnownCreature(creature.type)
        ? creature.description
        : 'Undiscovered creature',
    });

    this.changed.notify(creatureType);
  };
}
