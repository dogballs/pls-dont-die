import { LocalStorage } from '../core';

import { CreatureType, Resource, ResourceType, StoryStep } from './GameTypes';

type State = {
  hasSavedGame: boolean;
  storyStep: StoryStep;
  resources: Resource[];
  knownCreatureTypes: CreatureType[];
  knownCreatureResources: [CreatureType, ResourceType][];
  lastActiveCreature?: CreatureType;
};

const DEFAULT_STATE: State = {
  hasSavedGame: false,
  storyStep: 'intro',
  resources: [],
  knownCreatureTypes: [],
  knownCreatureResources: [],
  lastActiveCreature: undefined,
};

const PRESETS = {
  after_tutorial: {
    hasSavedGame: true,
    storyStep: 'first_act',
    resources: [
      new Resource({ type: 'dummium', amount: 1 }),
      new Resource({ type: 'soulium', amount: 1 }),
    ],
    knownCreatureTypes: ['dummy'],
    knownCreatureResources: [
      ['dummy', 'dummium'],
      ['dummy', 'soulium'],
    ],
    lastActiveCreature: undefined,
  } as State,
};

export class GameStore {
  private state: State = DEFAULT_STATE;
  constructor(private readonly storage: LocalStorage) {}

  resetStateToPreset(kind: 'after_tutorial') {
    this.state = PRESETS[kind];
    this.save();
  }

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
        this.state.resources[index] = new Resource({
          type: resourceToAdd.type,
          amount: this.state.resources[index].amount + resourceToAdd.amount,
        });
      } else {
        this.state.resources.push(resourceToAdd);
      }
    }
  }

  // removeResources(resourcesToRemove: Resource[]) {
  // const typesToRemove: ResourceType[] = [];
  // for (const resourceToRemove of resourcesToRemove) {
  //   const index = this.state.resources.findIndex((resource) => {
  //     return resource.type === resourceToRemove.type;
  //   });
  //   if (index >= 0) {
  //     this.state.resources[index] = new Resource({
  //       type: resourceToRemove.type,
  //       amount: this.state.resources[index].amount - resourceToRemove.amount,
  //     });
  //   } else {
  //     throw new Error('Can not remove a resource that does not exist');
  //   }
  //   if (this.state.resources[index].amount < 0) {
  //     throw new Error('Can not be negative');
  //   }
  //   if (this.state.resources[index].amount === 0) {
  //     typesToRemove.push(resourceToRemove.type);
  //   }
  // }
  // this.state.resources = this.state.resources.filter((resource) => {
  //   return !typesToRemove.includes(resource.type);
  // });
  // }

  hasResource(resourceType: ResourceType) {
    return this.state.resources.some((resource) => {
      return resource.type === resourceType;
    });
  }

  isKnownResourceForCreature(
    creatureType: CreatureType,
    resourceType: ResourceType,
  ) {
    return this.state.knownCreatureResources.some((item) => {
      return item[0] === creatureType && item[1] === resourceType;
    });
  }

  addKnownResourcesForCreature(
    creatureType: CreatureType,
    resources: Resource[],
  ) {
    for (const resource of resources) {
      if (this.isKnownResourceForCreature(creatureType, resource.type)) {
        continue;
      }
      this.state.knownCreatureResources.push([creatureType, resource.type]);
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

  setLastActiveCreature(creatureType: CreatureType) {
    this.state.lastActiveCreature = creatureType;
  }

  getLastActiveCreature() {
    return this.state.lastActiveCreature;
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
