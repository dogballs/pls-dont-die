import { GameObject, Rect, SpritePainter } from '../core';
import { Creature, GameUpdateArgs } from '../game';
import { config } from '../config';

export class SpiritResources extends GameObject {
  constructor() {
    super(96, 32);
  }

  protected setup({ gameStore, spriteLoader }: GameUpdateArgs) {
    const creature = Creature.fromConfig(config.CREATURES.spirit);

    const resources = creature.requiredResourceGroups
      .filter((group) => {
        return group.some((res) => {
          return res.type === 'soulium';
        });
      })
      .map((group) => {
        return group.find((res) => {
          return res.type !== 'soulium';
        });
      });

    for (const [index, resource] of resources.entries()) {
      const icon = new GameObject(32, 32);
      const type = gameStore.isKnownReqPairForCreature(
        creature.type,
        'soulium',
        resource.type,
      )
        ? resource.type
        : 'unknown';

      icon.painter = new SpritePainter(
        spriteLoader.load(`resource.${type}`, new Rect(0, 0, 32, 32)),
      );
      icon.position.set(index * 40, 0);
      this.add(icon);
    }
  }
}
