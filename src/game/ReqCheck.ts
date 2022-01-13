import { config } from '../config';

export class ReqCheck {
  static canSummon(creature: string) {
    return config.SUMMON_REQS[creature].length === 0;
  }
}
