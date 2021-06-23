import { BoardObject } from "../BoardObject";
import { MutableObject } from "./MutableObject";
import { Point } from "../Point";

export abstract class Creature extends MutableObject {
  /**
   *
   */
  constructor(id: number, position: Point, symbol: string = "C") {
    super(`#Creature${id}`, position, symbol);
  }

  abstract reproduce(creature: Creature): Creature[];
}
