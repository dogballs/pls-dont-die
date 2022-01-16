import { LocalStorage } from '../core';

import { CreatureType, Resource, ResourceType, StoryStep } from './GameTypes';

type State = {
  hasSavedGame: boolean;
  storyStep: StoryStep;
  resources: Resource[];
  knownCreatureTypes: CreatureType[];
};

const DEFAULT_STATE: State = {
  hasSavedGame: false,
  storyStep: 'intro',
  resources: [],
  knownCreatureTypes: [],
};

export class GameStore {
  private state: State = DEFAULT_STATE;
  constructor(private readonly storage: LocalStorage) {}

  setHasSavedGame() {
    this.state.hasSavedGame = true;
  }

  hasSavedGame() {
    return this.state.hasSavedGame;
  }

  addResources(resourcesToAdd: Resource[]) {
    for (const resourceToAdd of resourcesToAdd) {
      const index = this.state.resources.findIndex((resource) => {
        return resource.type === resourceToAdd.type;
      });
      if (index >= 0) {
        this.state.resources[index].amount += resourceToAdd.amount;
      } else {
        this.state.resources.push(resourceToAdd);
      }
    }
  }

  removeResources(resourcesToRemove: Resource[]) {
    const typesToRemove: ResourceType[] = [];

    for (const resourceToRemove of resourcesToRemove) {
      const index = this.state.resources.findIndex((resource) => {
        return resource.type === resourceToRemove.type;
      });
      if (index >= 0) {
        this.state.resources[index].amount -= resourceToRemove.amount;
      } else {
        throw new Error('Can not remove a resource that does not exist');
      }
      if (this.state.resources[index].amount < 0) {
        throw new Error('Can not be negative');
      }
      if (this.state.resources[index].amount === 0) {
        typesToRemove.push(resourceToRemove.type);
      }
    }

    for (let i = this.state.resources.length - 1; i >= 0; i--) {
      if (typesToRemove.includes(this.state.resources[i].type)) {
        delete this.state.resources[i];
      }
    }
  }

  getResourceAmount(type: ResourceType) {
    const resource = this.state.resources.find(
      (resource) => resource.type === type,
    );
    if (resource === undefined) {
      return 0;
    }
    return resource.amount;
  }

  getResources() {
    return this.state.resources;
  }

  setCreatureKnown(creatureType: CreatureType) {
    if (this.state.knownCreatureTypes.includes(creatureType)) {
      return;
    }
    this.state.knownCreatureTypes.push(creatureType);
  }

  isKnownCreature(creatureType: CreatureType) {
    return this.state.knownCreatureTypes.includes(creatureType);
  }

  setStoryStep(storyStep: StoryStep) {
    this.state.storyStep = storyStep;
  }

  getStoryStep() {
    return this.state.storyStep || 'intro';
  }

  reset() {
    this.state = DEFAULT_STATE;
  }

  load() {
    this.storage.load();
    this.state = (this.storage.get('game') as State) ?? DEFAULT_STATE;
  }

  save() {
    this.state.hasSavedGame = true;
    this.storage.set('game', this.state);
    this.storage.save();
  }
}
