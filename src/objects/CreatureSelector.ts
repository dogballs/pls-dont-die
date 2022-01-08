import {
  GameObject,
  MouseCode,
  SpritePainter,
  TextAlignment,
  TextPainter,
} from '../core';
import { GameUpdateArgs } from '../game';

import { ResourceItem } from './ResourceItem';

type Req = {
  type: string;
  amount: number;
};

type Option = {
  value: string;
  text: string;
  unknownText: string;
  reqs: Req[];
};

const options: Option[] = [
  { value: 'dummy', text: 'Dummy', unknownText: 'Unknown 0', reqs: [] },
  {
    value: 'fish',
    unknownText: 'Unknown 1',
    text: 'Fish',
    reqs: [
      {
        type: 'soulium',
        amount: 1,
      },
      {
        type: 'dummium',
        amount: 1,
      },
    ],
  },
];

export class CreatureSelector extends GameObject {
  private selectedIndex = 0;
  private arrowLeft: GameObject;
  private arrowRight: GameObject;
  private label: GameObject;
  private resourceItems: GameObject[] = [];

  constructor() {
    super(256, 160);
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
    this.updateContent();
  }

  protected update({ mouseIntersector }: GameUpdateArgs) {
    if (mouseIntersector.isDownAt(MouseCode.LeftClick, this.arrowLeft)) {
      this.selectPrev();
    }
    if (mouseIntersector.isDownAt(MouseCode.LeftClick, this.arrowRight)) {
      this.selectNext();
    }
  }

  private getSelectedOption() {
    return options[this.selectedIndex];
  }

  private selectPrev() {
    const prevIndex = Math.max(this.selectedIndex - 1, 0);
    this.selectIndex(prevIndex);
  }

  private selectNext() {
    const nextIndex = Math.min(this.selectedIndex + 1, options.length - 1);
    this.selectIndex(nextIndex);
  }

  private selectIndex(nextIndex: number) {
    if (this.selectedIndex === nextIndex) {
      return;
    }
    this.selectedIndex = nextIndex;
    this.updateContent();
  }

  private updateContent() {
    const selected = this.getSelectedOption();

    const painter = this.label.painter as TextPainter;
    painter.setOptions({ text: selected.unknownText });

    for (const item of this.resourceItems) {
      this.remove(item);
    }
    this.resourceItems = [];

    for (const [index, req] of selected.reqs.entries()) {
      const resourceItem = new ResourceItem(req.type, 0, req.amount);
      resourceItem.position.set(16, 75 + 40 * index);
      this.resourceItems.push(resourceItem);
      this.add(resourceItem);
    }
  }
}
