import {
  GameObject,
  Rect,
  SpritePainter,
  TextAlignment,
  TextPainter,
} from '../../core';
import { GameUpdateArgs, ResourceType } from '../../game';

const config = {
  none: { title: 'No modifier', spriteId: null },
  techium: { title: 'Techium', spriteId: 'resource.techium' },
  soulium: { title: 'Soulium', spriteId: 'resource.soulium' },
  dummium: { title: 'Dummium', spriteId: 'resource.dummium' },
  liquium: { title: 'Liquium', spriteId: 'resource.liquium' },
  sandium: { title: 'Sandium', spriteId: 'resource.sandium' },
  fishium: { title: 'Fishium', spriteId: 'resource.fishium' },
  arachium: { title: 'Arachium', spriteId: 'resource.arachium' },
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
  iconRect?: Rect;
}

const DEFAULT_OPTIONS = {
  amount: undefined,
  requiredAmount: undefined,
  defaultColor: '#fff',
  requiredColor: '#f25555',
  sufficientColor: '#28fb28',
  isNew: false,
  iconRect: new Rect(0, 0, 32, 32),
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

    const icon = new GameObject(
      this.options.iconRect.width,
      this.options.iconRect.height,
    );
    icon.position.setY((this.size.height - this.options.iconRect.height) / 2);
    if (resource.spriteId) {
      icon.painter = new SpritePainter(
        spriteLoader.load(resource.spriteId, this.options.iconRect),
      );
    }
    this.add(icon);

    let text = resource.title;
    let color = defaultColor;
    if (type === 'unknown') {
      color = '#aeaeae';
    } else if (type === 'none') {
    } else if (isNew) {
      text += ' (new)';
    } else if (amount !== undefined) {
      if (requiredAmount === undefined) {
        if (amount === Infinity) {
          text += ' (∞)';
        } else {
          text += ` (${amount})`;
          if (amount === 0) {
            color = requiredColor;
          }
        }
      } else {
        // text += ` (${amount}/${requiredAmount})`;
        // if (requiredAmount > amount) {
        if (amount === Infinity) {
          text += ` (∞/${requiredAmount})`;
          color = sufficientColor;
        } else if (amount === 0) {
          text += ` (${amount}/${requiredAmount})`;
          color = requiredColor;
        } else {
          text += ` (${amount}/${requiredAmount})`;
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
    title.position.set(this.options.iconRect.width + 12, 0);
    this.add(title);
  }
}
