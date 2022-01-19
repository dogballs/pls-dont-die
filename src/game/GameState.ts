import { Subject } from '../core';

import { CreatureType, EnvType, ResourceType } from './GameTypes';

export class GameState {
  databaseCreature: CreatureType;
  databaseCreatureChanged = new Subject<CreatureType>();
  creature: CreatureType;
  creatureChanged = new Subject<CreatureType>();
  essence: ResourceType;
  essenceChanged = new Subject<ResourceType>();
  modifier: ResourceType;
  modifierChanged = new Subject<ResourceType>();
  temp: number;
  tempChanged = new Subject<number>();
  env: EnvType;
  envChanged = new Subject<EnvType>();

  setDatabaseCreature(value) {
    this.databaseCreature = value;
    this.databaseCreatureChanged.notify(value);
  }

  setCreature(value) {
    this.creature = value;
    this.creatureChanged.notify(value);
  }

  setEssence(value) {
    this.essence = value;
    this.essenceChanged.notify(value);
  }

  setModifier(value) {
    this.modifier = value;
    this.modifierChanged.notify(value);
  }

  setTemp(value) {
    this.temp = value;
    this.tempChanged.notify(value);
  }

  setEnv(value) {
    this.env = value;
    this.envChanged.notify(value);
  }

  resetSelection() {
    this.creature = undefined;
    this.temp = undefined;
    this.env = undefined;
  }
}
