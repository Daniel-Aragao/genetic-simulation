import { BoardObject } from "../BoardObject";
import { MutableObject } from "./MutableObject";
import { Point } from "../Point";
import { Random } from "../../utilities/Random";

export type CreatureOptions = {
  size: number;
  step: number;
  sense: number;
};

export abstract class Creature extends MutableObject {
  private size: number;
  private step: number;
  private senseSize: number;

  public get Size() {
    return this.size;
  }
  public get Step() {
    return this.step;
  }
  public get SenseSize() {
    return this.senseSize;
  }

  /**
   *
   */
  constructor(
    id: number,
    position: Point,
    symbol: string = "C",
    options: CreatureOptions | null = null
  ) {
    super(`#Creature${id}`, position, symbol);

    this.size = options?.size ?? 1;
    this.step = options?.step ?? 1;
    this.senseSize = options?.sense ?? 0;
  }

  abstract reproduce(creature: Creature): Creature[];

  protected getRandomMovement(start: number) {
    return Random.getRandomInt(start - this.step, start + this.step + 1);
  }

  protected sense(): BoardObject[] {
    let result: BoardObject[] = [];

    let minY = this.position.Y - this.senseSize;
    let maxY = this.position.Y + this.senseSize;
    let minX = this.position.X - this.senseSize;
    let maxX = this.position.X + this.senseSize;

    for (let i = minY; i <= maxY; i++) {
      for (let j = minX; j <= maxX; j++) {
        let cell = this.board?.getCell(i, j);

        if (cell && cell.length > 0) {
          cell.forEach((o) => {
            if (o.Id != this.Id) {
              result.push(o);
            }
          });
        }
      }
    }

    return result;
  }

  protected stepIter(cb: (i: number, j: number) => void) {
    for (
      let i = this.position.Y - this.Step;
      i <= this.position.Y + this.Step;
      i++
    ) {
      for (
        let j = this.position.X - this.Step;
        j <= this.position.X + this.Step;
        j++
      ) {
        cb(i, j);
      }
    }
  }

  protected stepInto(p: Point): Point {
    if (p.distance(this.position) <= this.Step) {
      return p;
    } else {
      let min: Point | null = this.position;
      let minDistance = this.board?.Width ?? Number.MAX_VALUE;

      this.stepIter((i, j) => {
        let distance = this.position.distanceCoordinates(j, i);

        if (distance < minDistance) {
          min = new Point(j, i);
        }
      });

      return min;
    }
  }

  protected stepAway(p: Point): Point {
    if (p.distance(this.position) <= this.Step) {
      return p;
    } else {
      let max: Point | null = this.position;
      let maxDistance = Number.MIN_VALUE;

      this.stepIter((i, j) => {
        let distance = this.position.distanceCoordinates(j, i);

        if (distance > maxDistance) {
          max = new Point(j, i);
        }
      });

      return max;
    }
  }
}
