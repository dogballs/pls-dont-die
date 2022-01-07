import { GameObject } from './GameObject';
import { MouseCode, MouseInput } from './MouseInput';

export class MouseIntersector {
  constructor(private mouseInput: MouseInput) {}

  isDownAt(code: MouseCode, object: GameObject) {
    if (!this.mouseInput.isDown(code)) {
      return false;
    }
    const point = this.mouseInput.getDownPoint(code);
    const box = object.getWorldBoundingBox();

    return box.containsPoint(point);
  }
}
