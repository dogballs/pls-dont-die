import { GameObject, Rect, SpritePainter, TextPainter } from '../../core';
import { GameUpdateArgs, ResourceType } from '../../game';

export class ResourceIconPair extends GameObject {
  constructor(
    private readonly type1: ResourceType,
    private readonly type2: ResourceType,
  ) {
    super(96, 32);
  }

  protected setup({ spriteLoader }: GameUpdateArgs) {
    const icon1 = new GameObject(32, 32);
    icon1.painter = new SpritePainter(
      spriteLoader.load(`resource.${this.type1}`, new Rect(0, 0, 32, 32)),
    );
    this.add(icon1);

    const icon2 = new GameObject(32, 32);
    icon2.painter = new SpritePainter(
      spriteLoader.load(`resource.${this.type2}`, new Rect(0, 0, 32, 32)),
    );
    icon2.position.set(54, 0);
    this.add(icon2);

    const plus = new GameObject(32, 32);
    plus.painter = new TextPainter({
      text: '+',
      color: '#fff',
      alignment: TextPainter.Alignment.MiddleCenter,
    });
    plus.position.set(27, 0);
    this.add(plus);
  }
}
