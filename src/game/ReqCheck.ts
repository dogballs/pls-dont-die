import { config } from '../config';

export class ReqCheck {
  static canSummon(creature: string) {
    return config.REQS[creature].length === 0;
  }
}
