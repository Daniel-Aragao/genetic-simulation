import { Point } from "./Point";

export abstract class BoardObject {
  public get Id() {
    return this.id;
  }

  public get Symbol() {
    return this.symbol;
  }

  /**
   *
   */
  constructor(
    private id: string,
    public position: Point,
    private symbol: string = "#"
  ) {}

  abstract hitBy(object: BoardObject): void;
  abstract hitIt(object: BoardObject): void;

  abstract collide(object: BoardObject[]): BoardObject[];
}
