import {
  GameObject,
  Rect,
  SpritePainter,
  TextAlignment,
  TextPainter,
} from '../core';
import { GameUpdateArgs, ResourceType } from '../game';

const config = {
  soulium: { title: 'Soulium', spriteId: 'resource.soulium' },
  dummium: { title: 'Dummium', spriteId: 'resource.dummium' },
  fishium: { title: 'Fishium', spriteId: 'resource.fishium' },
};

interface ResourceItemOptions {
  type: ResourceType;
  amount?: number;
  requiredAmount?: number;
  defaultColor?: string;
  requiredColor?: string;
}

const DEFAULT_OPTIONS = {
  amount: null,
  requiredAmount: null,
  defaultColor: '#fff',
  requiredColor: '#f25555',
};

export class ResourceItem extends GameObject {
  private options: ResourceItemOptions;

  constructor(options: ResourceItemOptions) {
    super(182, 32);

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    const { type, amount, requiredAmount, defaultColor, requiredColor } =
      this.options;

    const resource = config[type];

    const icon = new GameObject(32, 32);
    icon.painter = new SpritePainter(
      spriteLoader.load(resource.spriteId, new Rect(0, 0, 32, 32)),
    );
    this.add(icon);

    let text = resource.title;
    let color = defaultColor;
    if (amount !== null) {
      if (requiredAmount === null) {
        text += ` (${amount})`;
      } else {
        text += ` (${amount}/${requiredAmount})`;
        if (requiredAmount > amount) {
          color = requiredColor;
        }
      }
    }

    const title = new GameObject(128, 32);
    title.painter = new TextPainter({
      text,
      color,
      alignment: TextAlignment.MiddleLeft,
    });
    title.position.set(48, 0);
    this.add(title);
  }
}
