export type StoryStep =
  | 'intro'
  | 'dummy_summon_live'
  | 'dummy_lived'
  | 'dummy_died'
  | 'first_act';

export type ResourceType =
  | 'none'
  | 'unknown'
  | 'techium'
  | 'dummium'
  | 'soulium'
  | 'liquium'
  | 'arachium'
  | 'sandium'
  | 'fishium';

export class Resource {
  readonly type: ResourceType;
  readonly amount: number;

  constructor(params: { type: ResourceType; amount: number }) {
    this.type = params.type;
    this.amount = params.amount;
  }

  static createUnknown() {
    return new Resource({ type: 'unknown', amount: 0 });
  }
}

export type CreatureType = 'dummy' | 'dummyfish' | 'scorporate' | 'fishy';

export class Creature {
  readonly type: CreatureType;
  readonly name: string;
  readonly unknownName: string;
  readonly description: string;
  readonly requiredResources: Resource[];
  readonly droppedResources: Resource[];

  constructor(params: {
    type: CreatureType;
    name: string;
    unknownName: string;
    description: string;
    requiredResources: Resource[];
    droppedResources: Resource[];
  }) {
    Object.assign(
      this,
      {
        description: '',
        requiredResources: [],
        droppedResources: [],
      },
      params,
    );
  }

  getRequiredAmountFor(resourceType: ResourceType) {
    const resource = this.requiredResources.find(
      (resource) => resource.type === resourceType,
    );
    if (!resource) {
      return 0;
    }
    return resource.amount;
  }

  static fromConfig(creatureConfig) {
    const requiredResources = creatureConfig.requiredResources.map(
      (resourceConfig) => {
        return new Resource(resourceConfig);
      },
    );

    const droppedResources = creatureConfig.droppedResources.map(
      (resourceConfig) => {
        return new Resource(resourceConfig);
      },
    );

    const creature = new Creature({
      type: creatureConfig.type,
      name: creatureConfig.name,
      unknownName: creatureConfig.unknownName,
      description: creatureConfig.description,
      requiredResources,
      droppedResources,
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

export type DeathType =
  | 'none'
  | 'short_circuit'
  | 'stuck_mech'
  | 'overheat'
  | 'dehydration'
  | 'drowning'
  | 'discomfort'
  | 'hypothermia';

export class Outcome {
  constructor(
    readonly status: 'alive' | 'death',
    readonly deathType: DeathType,
    readonly selection: Selection,
    readonly resources: Resource[] = [],
  ) {}
}
