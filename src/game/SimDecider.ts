import { CreatureType, EnvType, Outcome, Resource } from './GameTypes';

type Params = {
  temp: number;
  env: EnvType;
};

export class SimDecider {
  static decide(creature: CreatureType, params: Params) {
    switch (creature) {
      case 'dummy':
        return this.decideDummy(params);
    }
    throw new Error(`Unknown creature ${creature}`);
  }

  static decideDummy(params: Params): Outcome {
    if (params.temp === 0 && params.env === 'none') {
      return new Outcome('alive', [new Resource('dummium', 1)]);
    }
    return new Outcome('death', [new Resource('soulium', 1)]);
  }
}
