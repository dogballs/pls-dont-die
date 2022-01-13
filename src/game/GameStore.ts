import { LocalStorage } from '../core';

import { Resource, ResourceType } from './GameTypes';

export class GameStore {
  private state = {
    resources: [],
  };
  constructor(private readonly storage: LocalStorage) {}

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
}
