export enum MouseCode {
  LeftClick = 0,
}

type Point = {
  x: number;
  y: number;
};

export class MouseInput {
  private listenedDownCodes: number[] = [];
  private listenedDownPoints: Point[] = [];
  private downCodes: number[] = [];
  private downPoints: Point[] = [];
  private holdCodes: number[] = [];

  listen() {
    document.addEventListener('mousedown', this.handlwWindowMouseDown);
    document.addEventListener('mouseup', this.handlwWindowMouseUp);
  }

  update(scale: { x: number; y: number }) {
    const codes = this.listenedDownCodes;
    const points = this.listenedDownPoints;

    const downCodes = [];
    const downPoints: Point[] = [];
    const holdCodes = [];

    for (const [index, code] of codes.entries()) {
      const point = points[index];

      // Newly pressed key, which was not previously down or hold
      if (!this.downCodes.includes(code) && !this.holdCodes.includes(code)) {
        downCodes.push(code);
        downPoints.push({ x: point.x * scale.x, y: point.y * scale.y });
      }

      // Key that was down on previous frame is now considered hold, because
      // it is still down on current frame.
      // Hold key continues to be hold.
      if (this.downCodes.includes(code) || this.holdCodes.includes(code)) {
        holdCodes.push(code);
      }
    }

    this.downCodes = downCodes;
    this.downPoints = downPoints;
    this.holdCodes = holdCodes;
  }

  isDown(code: MouseCode) {
    return this.downCodes.includes(code);
  }

  getDownPoint(code: MouseCode) {
    const index = this.downCodes.indexOf(code);
    const point = this.downPoints[index];
    return point;
  }

  private handlwWindowMouseDown = (ev) => {
    const { button: code } = ev;

    const rect = ev.target.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;

    if (!this.listenedDownCodes.includes(code)) {
      this.listenedDownCodes.push(code);
      this.listenedDownPoints.push({ x, y });
    }
  };

  private handlwWindowMouseUp = (ev) => {
    const { button: code } = ev;

    const index = this.listenedDownCodes.indexOf(code);
    if (index !== -1) {
      this.listenedDownCodes.splice(index, 1);
      this.listenedDownPoints.splice(index, 1);
    }
  };
}
