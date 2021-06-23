import { Log } from "../../utilities/Log";
import { BoardObject } from "../BoardObject";
import { Point } from "../Point";
import { StaticObject } from "./StaticObject";

export class Wall extends StaticObject {
  collide(object: BoardObject[]): BoardObject[] {
    throw new Error("Method not implemented.");
  }
  /**
   *
   */
  constructor(id: number, position: Point, symbol: string = "W") {
    super(`#Wall${id}`, position, symbol);
  }

  hitBy(object: BoardObject): void {
    Log.print(`Hit by: ${object.Id}`);
  }
}
