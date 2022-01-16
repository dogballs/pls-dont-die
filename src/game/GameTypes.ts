export type StoryStep =
  | 'intro'
  | 'dummy_summon_live'
  | 'dummy_lived'
  | 'dummy_died'
  | 'first_act';

export type ResourceType = 'dummium' | 'soulium';
export class Resource {
  constructor(readonly type: ResourceType, public amount: number) {}
}

export type CreatureType = 'dummy' | 'fish';

export class Creature {
  readonly type: CreatureType;
  readonly name: string;
  readonly unknownName: string;
  readonly requiredResources: Resource[];

  constructor(params: {
    type: CreatureType;
    name: string;
    unknownName: string;
    requiredResources: Resource[];
  }) {
    Object.assign(this, params);
  }

  static fromConfig(creatureConfig) {
    const requiredResources = creatureConfig.requiredResources.map(
      (resourceConfig) => {
        return new Resource(resourceConfig.type, resourceConfig.amount);
      },
    );

    const creature = new Creature({
      type: creatureConfig.type,
      name: creatureConfig.name,
      unknownName: creatureConfig.unknownName,
      requiredResources,
    });

    return creature;
  }
}

export type EnvType = 'none' | 'desert' | 'underwater';

export class Selection {
  readonly creature: CreatureType;
  readonly env: EnvType;
  readonly temp: number;

  constructor(params: { creature: CreatureType; env: EnvType; temp: number }) {
    Object.assign(this, params);
  }

  static createFake() {
    return new Selection({
      creature: 'dummy',
      env: 'desert',
      temp: 10,
    });
  }

  static DEFAULT_TEMP = 0;
  static DEFAULT_ENV: EnvType = 'none';

  isDefault() {
    return (
      this.env === Selection.DEFAULT_ENV && this.temp === Selection.DEFAULT_TEMP
    );
  }
}

export type DeathType = 'none' | 'dummy_not_neutral';

export class Outcome {
  constructor(
    readonly status: 'alive' | 'death',
    readonly deathType: DeathType,
    readonly selection: Selection,
    readonly resources: Resource[] = [],
  ) {}
}
