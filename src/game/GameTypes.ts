export type CreatureType = 'dummy' | 'fish';

export type EnvType = 'none' | 'desert' | 'underwater';

export type ResourceType = 'dummium' | 'soulium';
export class Resource {
  constructor(readonly type: ResourceType, readonly amount: number) {}
}

export class Outcome {
  constructor(
    readonly status: 'alive' | 'death',
    readonly resources: Resource[] = [],
    readonly reason: string = '',
  ) {}
}
