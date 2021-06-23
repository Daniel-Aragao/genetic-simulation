import { Board } from "./../Board";
import { Log } from "../../utilities/Log";
import { Random } from "../../utilities/Random";
import { BoardObject } from "../BoardObject";
import { Point } from "../Point";
import { Creature, CreatureOptions } from "./Creature";
import { MutableObject } from "./MutableObject";
import { StaticObject } from "../staticObjects/StaticObject";

export class Goop extends Creature {
  private collected: BoardObject[] = [];
  public collectionLimit = 0;

  public get isCollectionFull() {
    return this.collectionLimit
      ? this.collected.length >= this.collectionLimit
      : false;
  }

  public get Collection() {
    return this.collected.map((i) => i);
  }

  private symbols = ["○", "◔", "◕", "●"];

  private setFullnessSymbol() {
    if (this.collectionLimit == 0) {
      if (this.collected.length == 0) {
        this.symbol = this.symbols[0];
      } else {
        this.symbol = this.symbols[3];
      }
    } else if (!this.isCollectionFull) {
      let fullness =
        (this.collected.length / this.collectionLimit) * this.symbols.length;

      fullness = Math.floor(fullness);
      this.symbol = this.symbols[fullness % this.symbols.length];
    } else {
      this.symbol = this.symbols[3];
    }
  }

  /**
   *
   */
  constructor(
    id: number,
    position: Point,
    options: CreatureOptions | null = null
  ) {
    super(id, position, "○", options);
  }

  public addToCollection(obj: BoardObject): boolean {
    if (!this.isCollectionFull) {
      this.collected.push(obj);
      this.setFullnessSymbol();
      Log.print("Eat");
      return true;
    }
    Log.print("Not Eat");

    return false;
  }

  collide(objects: BoardObject[]): BoardObject[] {
    if (this.isCollectionFull) {
      objects = objects.filter((o) => !o.Id.startsWith("#Coin"));
    }

    return objects;
  }
  reproduce(creature: Creature): Creature[] {
    throw new Error("Method not implemented.");
  }

  act(): Point {
    let objs = this.sense();

    if (this.board?.sizeSuperiority) {
      let runFromPoint = this.run(objs);

      if (runFromPoint) {
        return this.stepAway(runFromPoint);
      }
    }

    let followPoint = this.follow(objs);

    if (followPoint) {
      return this.stepInto(followPoint);
    }

    let x = this.getRandomMovement(this.position.X);
    let y = this.getRandomMovement(this.position.Y);

    return new Point(x, y);
  }

  hitBy(object: BoardObject): void {
    Log.print(`Hit by: ${object.Id}`);
  }

  hitIt(object: BoardObject): void {
    Log.print(`Hit it: ${object.Id}`);

    if (object.Id.startsWith("#Coin")) {
      if (this.addToCollection(object)) {
        if (!this.board?.killObject(object as StaticObject)) {
          throw Error(`Coin should be consumed: ${this.Id}:${object.Id}`);
        }
      }
    }
  }

  private follow(objs: BoardObject[]): Point | null {
    if (this.isCollectionFull) return null;

    let distances: { p: Point; distance: number }[] = [];
    let min: Point | null = null;
    let minDistance = this.board?.Width ?? Number.MAX_VALUE;

    objs
      .filter((o) => o.Id.startsWith("#Coin"))
      .forEach((coin) => {
        distances.push({
          p: coin.position,
          distance: this.position.distance(coin.position),
        });
      });

    distances.forEach((distance) => {
      if (distance.distance < minDistance) {
        min = distance.p;
      }
    });

    if (min) {
      Log.print2(
        `Follow: ${this.Id} : ${(min as Point).X} ${(min as Point).Y}`
      );
    }

    return min;
  }

  private run(objs: BoardObject[]): Point | null {
    let distances: { p: Point; distance: number }[] = [];
    let max: Point | null = null;
    let maxDistance = Number.MIN_VALUE;

    objs
      .filter((o) => o.Id.startsWith("#Creature"))
      .forEach((creature, i: number) => {
        let c = creature as Creature;
        if (c.Size * (this.board?.sizeSuperiority ?? 0) > this.Size) {
          let weight = c.Size / this.Size;

          distances.push({
            p: creature.position,
            distance: this.position.distance(creature.position) * weight,
          });
        }
      });

    distances.forEach((distance) => {
      if (distance.distance < maxDistance) {
        max = distance.p;
      }
    });

    return max;
  }
}
