import {
  AliveModal,
  Cage,
  CreatureObject,
  CreatureSelector,
  ControlPanel,
  DeathModal,
  DoctorModal,
  IconTextButton,
  Inventory,
  Sidebar,
  Simulation,
  SummonPanel,
  Summoning,
} from '../objects';
import {
  DoctorLines,
  GameState,
  GameStore,
  GameUpdateArgs,
  Outcome,
  Resource,
  Selection,
  SimDecider,
} from '../game';

import { GameScene } from './GameScene';
import { GameSceneType } from './GameSceneType';

export class LevelSimulateScene extends GameScene {
  protected setup({ gameState, gameStore }: GameUpdateArgs) {}
}
