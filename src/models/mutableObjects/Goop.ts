import { Log } from "../../utilities/Log";
import { Random } from "../../utilities/Random";
import { BoardObject } from "../BoardObject";
import { Point } from "../Point";
import { Creature } from "./Creature";

export class Goop extends Creature {
  /**
   *
   */
  constructor(id: number, position: Point, symbol: string = "g") {
    super(id, position, symbol);
  }

  collide(objects: BoardObject[]): BoardObject[] {
    return objects;
  }
  reproduce(creature: Creature): Creature[] {
    throw new Error("Method not implemented.");
  }
  act(): Point {
    let x = this.getRandomMovement(this.position.X);
    let y = this.getRandomMovement(this.position.Y);
    Log.print(this.position.X, this.position.Y, x, y);
    return new Point(x, y);
  }
  hitBy(object: BoardObject): void {
    Log.print(`Hit by: ${object.Id}`);
  }
  hitIt(object: BoardObject): void {
    Log.print(`Hit it: ${object.Id}`);
  }

  private getRandomMovement(start: number) {
    return Random.getRandomInt(start - 1, start + 2);
  }
}
