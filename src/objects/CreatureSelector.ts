import { GameObject, Subject, TextPainter } from '../core';
import { Creature, CreatureType, GameStore, GameUpdateArgs } from '../game';
import { config } from '../config';

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
  private selector: Selector<CreatureType>;
  private arrowLeft: GameObject;
  private arrowRight: GameObject;
  private description: GameObject;
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

  select(creatureType: CreatureType) {
    this.selector.select(creatureType);
  }

  protected setup({ gameState, gameStore }: GameUpdateArgs) {
    this.gameStore = gameStore;

    if (this.options.mode === 'select' || this.options.mode === 'locked') {
      // const shouldBlinkNext = !gameStore.isKnownCreature('fish');
      this.selector = new Selector(this.getChoices(), {
        defaultValue: this.options.preselectedCreature,
        locked: this.options.mode === 'locked',
        // blinkNext: shouldBlinkNext,
      });
      this.selector.position.set(0, 36);
      this.selector.changed.addListener(this.handleSelected);
      this.add(this.selector);

      this.description = new GameObject(256, 24);
      this.description.painter = new TextPainter({
        text: 'Undiscovered creature',
        color: '#aaa',
        size: 14,
        alignment: TextPainter.Alignment.MiddleCenter,
      });
      this.description.position.set(0, 70);
      this.add(this.description);
    } else {
      const section = new Section({
        width: this.size.width,
        height: this.size.height,
        title: 'Creature',
      });
      this.add(section);

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

  protected update() {
    if (this.options.mode === 'select' || this.options.mode === 'locked') {
      this.selector.setChoices(this.getChoices());
      this.updateDescription();
    }
  }

  private getChoices() {
    const choices = Object.keys(config.CREATURES).map((creatureType) => {
      const creatureConfig = config.CREATURES[creatureType];
      const creature = Creature.fromConfig(creatureConfig);
      const name = this.gameStore.isKnownCreature(creature.type)
        ? creature.name
        : creature.unknownName;

      return {
        label: name,
        value: creature.type,
      };
    });

    return choices;
  }

  private updateDescription() {
    const creatureType = this.selector.getValue();
    if (!creatureType) return;

    const creatureConfig = config.CREATURES[creatureType];
    const creature = Creature.fromConfig(creatureConfig);

    (this.description.painter as TextPainter).setOptions({
      text: this.gameStore.isKnownCreature(creature.type)
        ? creature.description
        : 'Undiscovered creature',
    });
  }

  private handleSelected = (creatureType: CreatureType) => {
    this.updateDescription();
    this.changed.notify(creatureType);
  };
}
