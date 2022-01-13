import {
  GameObject,
  MouseCode,
  SpritePainter,
  Subject,
  TextAlignment,
  TextPainter,
} from '../core';
import { CreatureType, GameUpdateArgs, Resource } from '../game';

import { ResourceItem } from './ResourceItem';

type Choice = {
  type: CreatureType;
  text: string;
  unknownText: string;
  requiredResources: Resource[];
};

const choices: Choice[] = [
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

  protected setup({ spriteLoader }: GameUpdateArgs) {
    const title = new GameObject(256, 32);
    title.painter = new TextPainter({
      text: 'Creature',
      color: '#fff',
      size: 18,
    });
    this.add(title);

    this.arrowLeft = new GameObject(32, 32);
    this.arrowLeft.position.set(0, 32);
    this.arrowLeft.painter = new SpritePainter(spriteLoader.load('arrowLeft'));
    this.add(this.arrowLeft);

    this.arrowRight = new GameObject(32, 32);
    this.arrowRight.position.set(224, 32);
    this.arrowRight.painter = new SpritePainter(
      spriteLoader.load('arrowRight'),
    );
    this.add(this.arrowRight);

    this.label = new GameObject(192, 32);
    this.label.position.set(32, 32);
    this.label.painter = new TextPainter({
      color: '#fff',
      size: 24,
      alignment: TextAlignment.MiddleCenter,
    });
    this.add(this.label);

    const defaultIndex = choices.findIndex(
      (choice) => choice.type === this.options.preselectedCreature,
    );
    this.selectIndex(defaultIndex);
  }

  protected update({ mouseIntersector }: GameUpdateArgs) {
    if (mouseIntersector.isDownAt(MouseCode.LeftClick, this.arrowLeft)) {
      this.selectPrev();
    }
    if (mouseIntersector.isDownAt(MouseCode.LeftClick, this.arrowRight)) {
      this.selectNext();
    }
  }

  private getSelectedChoice() {
    return choices[this.selectedIndex];
  }

  private selectPrev() {
    const prevIndex = Math.max(this.selectedIndex - 1, 0);
    this.selectIndex(prevIndex);
  }

  private selectNext() {
    const nextIndex = Math.min(this.selectedIndex + 1, choices.length - 1);
    this.selectIndex(nextIndex);
  }

  private selectIndex(nextIndex: number) {
    if (this.selectedIndex === nextIndex) {
      return;
    }
    this.selectedIndex = nextIndex;
    this.updateContent();
    this.changed.notify(this.getSelectedChoice().type);
  }

  private updateContent() {
    const selected = this.getSelectedChoice();

    const painter = this.label.painter as TextPainter;
    painter.setOptions({ text: selected.unknownText });

    for (const item of this.resourceItems) {
      this.remove(item);
    }
    this.resourceItems = [];

    for (const [index, req] of selected.requiredResources.entries()) {
      // TODO: add current amount
      const resourceItem = new ResourceItem({
        type: req.type,
        amount: 0,
        requiredAmount: req.amount,
      });
      resourceItem.position.set(16, 75 + 40 * index);
      this.resourceItems.push(resourceItem);
      this.add(resourceItem);
    }
  }
}
