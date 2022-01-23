import { LocalStorage } from '../core';

import { CreatureType, Resource, ResourceType, StoryStep } from './GameTypes';

type State = {
  hasSavedGame: boolean;
  storyStep: StoryStep;
  resources: Resource[];
  knownCreatureTypes: CreatureType[];
  knownCreatureResourceDrops: [CreatureType, ResourceType][];
  knownCreatureResourceReqs: [CreatureType, ResourceType, ResourceType][];
  knownResources?: ResourceType[];
  lastActiveCreature?: CreatureType;
  lastActiveEssence?: ResourceType;
  lastActiveModifier?: ResourceType;
};

const DEFAULT_STATE: State = {
  hasSavedGame: false,
  storyStep: 'intro',
  resources: [],
  knownCreatureTypes: [],
  knownCreatureResourceDrops: [],
  knownCreatureResourceReqs: [],
  knownResources: [],
  lastActiveCreature: undefined,
  lastActiveEssence: undefined,
  lastActiveModifier: undefined,
};

const PRESETS = {
  after_tutorial: {
    hasSavedGame: true,
    storyStep: 'spirit_first_encounter',
    resources: [],
    knownCreatureTypes: [],
    knownCreatureResourceDrops: [],
    knownCreatureResourceReqs: [],
    knownResources: [],
    lastActiveCreature: undefined,
    lastActiveEssence: undefined,
    lastActiveModifier: undefined,
  } as State,
  all_resources: {
    hasSavedGame: true,
    storyStep: 'spirit_first_encounter',
    resources: [],
    knownCreatureTypes: [],
    knownCreatureResourceDrops: [],
    knownCreatureResourceReqs: [],
    knownResources: [
      'dummium',
      'fishium',
      'arachium',
      'reptilium',
      'soulium',
      'techium',
      'liquium',
      'sandium',
      'windium',
      'flamium',
    ],
    lastActiveCreature: undefined,
    lastActiveEssence: undefined,
    lastActiveModifier: undefined,
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

  removeResources(resourcesToRemove: Resource[]) {
    const typesToRemove: ResourceType[] = [];
    for (const resourceToRemove of resourcesToRemove) {
      // const index = this.state.resources.findIndex((resource) => {
      //   return resource.type === resourceToRemove.type;
      // });
      // if (index >= 0) {
      //   this.state.resources[index] = new Resource({
      //     type: resourceToRemove.type,
      //     amount: this.state.resources[index].amount - resourceToRemove.amount,
      //   });
      // } else {
      //   throw new Error('Can not remove a resource that does not exist');
      // }
      // if (this.state.resources[index].amount < 0) {
      //   throw new Error('Can not be negative');
      // }
      // if (this.state.resources[index].amount === 0) {
      //   typesToRemove.push(resourceToRemove.type);
      // }
    }
    // this.state.resources = this.state.resources.filter((resource) => {
    //   return !typesToRemove.includes(resource.type);
    // });
  }

  hasResource(resourceType: ResourceType) {
    return this.state.resources.some((resource) => {
      return resource.type === resourceType;
    });
  }

  isKnownDropForCreature(
    creatureType: CreatureType,
    resourceType: ResourceType,
  ) {
    return this.state.knownCreatureResourceDrops.some((item) => {
      return item[0] === creatureType && item[1] === resourceType;
    });
  }

  addKnownDropsForCreature(creatureType: CreatureType, resources: Resource[]) {
    for (const resource of resources) {
      if (this.isKnownDropForCreature(creatureType, resource.type)) {
        continue;
      }
      this.state.knownCreatureResourceDrops.push([creatureType, resource.type]);
    }
  }

  isKnownReqPairForCreature(
    creatureType: CreatureType,
    resourceType1: ResourceType,
    resourceType2: ResourceType,
  ) {
    return this.state.knownCreatureResourceReqs.some((item) => {
      if (item[0] !== creatureType) {
        return false;
      }
      if (item[1] === resourceType1 && item[2] === resourceType2) {
        return true;
      }
      if (item[1] === resourceType2 && item[2] === resourceType1) {
        return true;
      }
      return false;
    });
  }

  addKnownReqPairForCreature(
    creatureType: CreatureType,
    resourceType1: ResourceType,
    resourceType2: ResourceType,
  ) {
    if (
      this.isKnownReqPairForCreature(creatureType, resourceType1, resourceType2)
    ) {
      return;
    }
    this.state.knownCreatureResourceReqs.push([
      creatureType,
      resourceType1,
      resourceType2,
    ]);
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

  setLastActiveEssence(essence: ResourceType) {
    this.state.lastActiveEssence = essence;
  }

  getLastActiveEssence() {
    return this.state.lastActiveEssence;
  }

  setLastActiveModifier(modifier: ResourceType) {
    this.state.lastActiveModifier = modifier;
  }

  getLastActiveModifier() {
    return this.state.lastActiveModifier;
  }

  isKnownResource(resourceType: ResourceType) {
    return this.state.knownResources.includes(resourceType);
  }

  addKnownResources(resources: Resource[]) {
    for (const resource of resources) {
      if (this.isKnownResource(resource.type)) {
        continue;
      }
      this.state.knownResources.push(resource.type);
    }
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
