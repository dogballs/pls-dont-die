import { GameObject } from './GameObject';
import { MouseCode, MouseInput } from './MouseInput';

export class MouseIntersector {
  private enterListeners = new Map<
    GameObject,
    'out' | 'in' | 'enter' | 'leave'
  >();
  private trapStack: GameObject[] = [];

  constructor(private mouseInput: MouseInput) {}

  listenEnter(object: GameObject) {
    this.enterListeners.set(object, 'out');
  }

  resetListeners() {
    this.enterListeners.clear();
  }

  update() {
    const point = this.mouseInput.getOverPoint();
    if (!point) {
      return;
    }

    for (const [object, value] of this.enterListeners) {
      const box = object.getWorldBoundingBox();
      const isOver = box.containsPoint(point);

      let nextValue = value;

      if (value === 'out') {
        if (isOver) {
          nextValue = 'enter';
        }
      } else if (value === 'enter') {
        if (isOver) {
          nextValue = 'in';
        } else {
          nextValue = 'out';
        }
      } else if (value === 'in') {
        if (!isOver) {
          nextValue = 'leave';
        }
      } else if (value === 'leave') {
        if (isOver) {
          nextValue = 'enter';
        } else {
          nextValue = 'out';
        }
      }

      this.enterListeners.set(object, nextValue);
    }
  }

  isDownAt(code: MouseCode, object: GameObject) {
    if (!this.mouseInput.isDown(code)) {
      return false;
    }
    if (!this.canActInTrap(object)) {
      return false;
    }

    const point = this.mouseInput.getDownPoint(code);
    const box = object.getWorldBoundingBox();

    return box.containsPoint(point);
  }

  isEnterAt(object: GameObject) {
    if (!this.canActInTrap(object)) {
      return false;
    }

    return this.enterListeners.get(object) === 'enter';
  }

  isLeaveAt(object: GameObject) {
    return this.enterListeners.get(object) === 'leave';
  }

  trap(object: GameObject) {
    this.trapStack.push(object);
  }

  untrap(object: GameObject) {
    if (this.trapStack[this.trapStack.length - 1] !== object) {
      throw new Error(
        'Untrapping something that is not at the end of the stack',
      );
    }

    this.trapStack.pop();
  }

  private canActInTrap(object: GameObject) {
    if (this.trapStack.length === 0) {
      return true;
    }
    const lastTrapObject = this.trapStack[this.trapStack.length - 1];
    return lastTrapObject === object || lastTrapObject.hasChild(object);
  }
}
