export class Vector {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;

    return this;
  }

  setX(x: number) {
    this.x = x;

    return this;
  }

  setY(y: number) {
    this.y = y;

    return this;
  }

  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  addX(x: number) {
    this.x += x;

    return this;
  }

  addY(y: number) {
    this.y += y;

    return this;
  }

  addScalar(s: number) {
    this.x += s;
    this.y += s;

    return this;
  }

  sub(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  subX(x: number) {
    this.x -= x;

    return this;
  }

  subY(y: number) {
    this.y -= y;

    return this;
  }

  divide(v: Vector) {
    this.x /= v.x;
    this.y /= v.y;

    return this;
  }

  divideScalar(s: number) {
    this.x /= s;
    this.y /= s;

    return this;
  }

  mult(v: Vector) {
    this.x *= v.x;
    this.y *= v.y;

    return this;
  }

  multScalar(s: number) {
    this.x *= s;
    this.y *= s;

    return this;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  }

  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  normalize() {
    const length = this.length() || 1; // In case length is zero

    this.divideScalar(length);

    return this;
  }

  distanceTo(v: Vector) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;

    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    return distance;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;

    return this;
  }

  copyFrom(v: Vector) {
    this.x = v.x;
    this.y = v.y;

    return this;
  }

  snapX(step = 1) {
    this.x = Math.round(this.x / step) * step;

    return this;
  }

  snapY(step = 1) {
    this.y = Math.round(this.y / step) * step;

    return this;
  }

  dot(v: Vector) {
    return this.x * v.x + this.y * v.y;
  }

  cross(v: Vector) {
    return this.x * v.y - this.y * v.x;
  }

  equals(v: Vector) {
    return this.x === v.x && this.y === v.y;
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  static fromArray(array: number[]) {
    return new Vector(array[0], array[1]);
  }
}
