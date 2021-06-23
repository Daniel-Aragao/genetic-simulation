import { BoardObject } from "../BoardObject";

export abstract class StaticObject extends BoardObject {
  hitIt(object: BoardObject): void {
    throw new Error("Static objects cannot hit.");
  }
}
