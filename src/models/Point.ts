export class Point {
  /**
   *
   */
  constructor(private x: number, private y: number) {}

  get X() {
    return this.x;
  }
  get Y() {
    return this.y;
  }

  equals(p: Point) {
    return p.X == this.X && p.Y == this.Y;
  }

  clone() {
    return new Point(this.X, this.Y);
  }

  distance(p: Point): number {
    return this.distanceCoordinates(p.X, p.Y);
  }

  distanceCoordinates(x: number, y: number): number {
    return Math.sqrt(Math.pow(this.X - x, 2) + Math.pow(this.Y - y, 2));
  }
}
