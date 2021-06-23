import { Board } from "./../Board";
import { Log } from "../../utilities/Log";
import { Random } from "../../utilities/Random";
import { BoardObject } from "../BoardObject";
import { Point } from "../Point";
import { Creature } from "./Creature";
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
  constructor(id: number, position: Point, symbol: string = "○") {
    super(id, position, symbol);
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

  private getRandomMovement(start: number) {
    return Random.getRandomInt(start - 1, start + 2);
  }
}
