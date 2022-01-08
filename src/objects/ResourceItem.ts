import {
  GameObject,
  Rect,
  SpritePainter,
  TextAlignment,
  TextPainter,
} from '../core';
import { GameUpdateArgs } from '../game';

const config = {
  soulium: { title: 'Soulium', spriteId: 'resource.soulium' },
  fishium: { title: 'Fishium', spriteId: 'resource.fishium' },
};

export class ResourceItem extends GameObject {
  constructor(
    readonly type = 'soulium',
    readonly currentAmount: number = null,
    readonly requiredAmount: number = null,
  ) {
    super(182, 32);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    const resource = config[this.type];

    const icon = new GameObject(32, 32);
    icon.painter = new SpritePainter(
      spriteLoader.load(resource.spriteId, new Rect(0, 0, 32, 32)),
    );
    this.add(icon);

    let text = resource.title;
    let color = '#fff';
    if (this.currentAmount !== null) {
      if (this.requiredAmount === null) {
        text += ` (${this.currentAmount})`;
      } else {
        text += ` (${this.currentAmount}/${this.requiredAmount})`;
        if (this.requiredAmount > this.currentAmount) {
          color = 'red';
        }
      }
    }

    const title = new GameObject(96, 32);
    title.painter = new TextPainter({
      text,
      color,
      alignment: TextAlignment.MiddleLeft,
    });
    title.position.set(48, 0);
    this.add(title);
  }
}
