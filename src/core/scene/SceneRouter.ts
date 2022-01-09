import { Subject } from '../Subject';

import { SceneNavigator, SceneParams } from './SceneNavigator';
import { SceneType } from './SceneType';

interface SceneLocation {
  type: SceneType;
  params: SceneParams;
}

export class SceneRouter<S> implements SceneNavigator {
  transitionStarted = new Subject();
  private routes = new Map<
    SceneType,
    { new (navigator: SceneNavigator, params: SceneParams): S }
  >();
  private location: SceneLocation;
  private scene: S = null;
  private stack: SceneLocation[] = [];

  register(
    type: SceneType,
    Scene: { new (navigator: SceneNavigator, params: SceneParams): S },
  ) {
    this.routes.set(type, Scene);
  }

  start(type: SceneType, params?: SceneParams) {
    this.assertRegistered(type);

    this.push(type, params);
  }

  getCurrentScene(): S {
    return this.scene;
  }

  push(type: SceneType, params?: SceneParams) {
    this.assertRegistered(type);

    const location = this.transition(type, params);

    this.stack.push(location);
  }

  replace(type: SceneType, params?: SceneParams) {
    this.assertRegistered(type);

    this.stack.pop();

    const location = this.transition(type, params);

    this.stack.push(location);
  }

  back() {
    // Can't back if only one scene left in stack
    if (this.stack.length === 1) {
      return;
    }

    this.stack.pop();

    const lastLocation = this.stack[this.stack.length - 1];

    this.transition(lastLocation.type, lastLocation.params);
  }

  clearAndPush(type: SceneType, params?: SceneParams) {
    this.assertRegistered(type);

    this.stack = [];
    this.push(type, params);
  }

  private transition(type: SceneType, params: SceneParams = {}): SceneLocation {
    this.assertRegistered(type);

    this.transitionStarted.notify(null);

    const NextSceneClass = this.routes.get(type);

    const nextScene = new NextSceneClass(this, params);

    this.scene = nextScene;

    const nextLocation: SceneLocation = {
      type,
      params,
    };

    this.location = nextLocation;

    return this.location;
  }

  private assertRegistered(type: SceneType) {
    if (!this.routes.has(type)) {
      throw new Error(`Scene "${type}" not registered`);
    }
  }
}
