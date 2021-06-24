import { Board } from "./../Board";
import { Log } from "../../utilities/Log";
import { Random } from "../../utilities/Random";
import { BoardObject } from "../BoardObject";
import { Point } from "../Point";
import { Creature, CreatureOptions } from "./Creature";
import { MutableObject } from "./MutableObject";
import { StaticObject } from "../staticObjects/StaticObject";
import { Coin } from "../staticObjects/Coin";

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

  public get CoinsCollected() {
    return this.Collection.filter((o) => o.Id.startsWith(Coin.ID_PREFIX))
      .length;
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

      return true;
    }

    return false;
  }

  collide(objects: BoardObject[]): BoardObject[] {
    // if (this.isCollectionFull) {
    //   objects = objects.filter((o) => !o.Id.startsWith(Coin.ID_PREFIX));
    // }

    return objects.filter((o) => !o.Id.startsWith(Coin.ID_PREFIX));
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
      let step = this.stepInto(followPoint);
      Log.print(`Step: ${this.Id} : ${step.X} ${step.Y}`);
      return step;
    }

    this.setFullnessSymbol();

    let x = this.getRandomMovement(this.position.X);
    let y = this.getRandomMovement(this.position.Y);

    return new Point(x, y);
  }

  hitBy(object: BoardObject): void {
    Log.print(`Hit by: ${object.Id}`);
  }

  hitIt(object: BoardObject): void {
    Log.print(`Hit it: ${object.Id}`);

    if (object.Id.startsWith(Coin.ID_PREFIX)) {
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
      .filter((o) => o.Id.startsWith(Coin.ID_PREFIX))
      .forEach((coin) => {
        distances.push({
          p: coin.position,
          distance: this.position.distance(coin.position),
        });
      });

    distances.forEach((distance) => {
      if (distance.distance < minDistance) {
        min = distance.p;
        minDistance = distance.distance;
      }
    });

    if (min) {
      this.symbol = "💰";
      Log.print(`Follow: ${this.Id} : ${(min as Point).X} ${(min as Point).Y}`);
    }

    return min;
  }

  private run(objs: BoardObject[]): Point | null {
    let distances: { p: Point; distance: number }[] = [];
    let max: Point | null = null;
    let maxDistance = Number.MIN_VALUE;

    objs
      .filter((o) => o.Id.startsWith("#Creature"))
      .forEach((c) => {
        let creature = c as Creature;

        if (this.Size * (this.board?.sizeSuperiority ?? 0) < creature.Size) {
          let weight = creature.Size / this.Size;

          distances.push({
            p: creature.position,
            distance: this.position.distance(creature.position) * weight,
          });
        }
      });

    distances.forEach((distance) => {
      if (distance.distance > maxDistance) {
        max = distance.p;
        maxDistance = distance.distance;
      }
    });

    if (max) {
      this.symbol = "🏃";
      Log.print(`Run: ${this.Id} : ${(max as Point).X} ${(max as Point).Y}`);
    }

    return max;
  }
}
