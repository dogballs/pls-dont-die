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
  unknown: { title: 'Undiscovered', spriteId: 'resource.unknown' },
};

interface ResourceItemOptions {
  type: ResourceType;
  amount?: number;
  requiredAmount?: number;
  defaultColor?: string;
  requiredColor?: string;
  sufficientColor?: string;
  isNew?: boolean;
}

const DEFAULT_OPTIONS = {
  amount: undefined,
  requiredAmount: undefined,
  defaultColor: '#fff',
  requiredColor: '#f25555',
  sufficientColor: '#28fb28',
  isNew: false,
};

export class ResourceItem extends GameObject {
  private options: ResourceItemOptions;

  constructor(options: ResourceItemOptions) {
    super(182, 32);

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    const {
      type,
      amount,
      requiredAmount,
      defaultColor,
      requiredColor,
      sufficientColor,
      isNew,
    } = this.options;

    const resource = config[type];

    const icon = new GameObject(32, 32);
    icon.painter = new SpritePainter(
      spriteLoader.load(resource.spriteId, new Rect(0, 0, 32, 32)),
    );
    this.add(icon);

    let text = resource.title;
    let color = defaultColor;
    if (type === 'unknown') {
      color = '#aeaeae';
    } else if (isNew) {
      text += ' (new)';
    } else if (amount !== undefined) {
      if (requiredAmount === undefined) {
        // text += ` (${amount})`;
      } else {
        // text += ` (${amount}/${requiredAmount})`;
        // if (requiredAmount > amount) {
        if (amount === 0) {
          text += ` (0/1)`;
          color = requiredColor;
        } else {
          text += ` (1/1)`;
          color = sufficientColor;
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
