import { Counter } from "../utilities/Counter";
import { BoardObject } from "./BoardObject";
import { MutableObject } from "./mutableObjects/MutableObject";
import { Point } from "./Point";
import { StaticObject } from "./staticObjects/StaticObject";
import { Wall } from "./staticObjects/Wall";

type Collision = {
  source: BoardObject;
  target: BoardObject;
  position: Point;
};

export class Board {
  private staticObjects: StaticObject[] = [];
  private mutableObjects: MutableObject[] = [];
  private colissions: Collision[] = [];

  private map: BoardObject[][][] = [];
  /**
   *
   */
  constructor(
    private width: number,
    private height: number,
    walls: boolean = false
  ) {
    this.resetMap(walls);
  }

  public get Width() {
    return this.width;
  }

  public get Height() {
    return this.height;
  }

  public resetMap(walls: boolean = false) {
    this.map = [];
    let wallCounter = new Counter(1);

    for (let i = 0; i < this.Height; i++) {
      this.map[i] = [];

      for (let j = 0; j < this.Width; j++) {
        this.map[i][j] = [];

        if (i == 0 || i == this.Height - 1 || j == 0 || j == this.Width - 1) {
          this.addStaticObject(new Wall(wallCounter.next, new Point(j, i)));
        }
      }
    }
  }

  private kill(obj: BoardObject, objs: BoardObject[]) {
    var index = objs.findIndex((o) => o.Id == obj.Id);

    if (index == -1) return false;

    objs.splice(index, 1);

    return true;
  }

  killStatic(obj: BoardObject): boolean {
    if (this.kill(obj, this.map[obj.position.Y][obj.position.X])) {
      return this.kill(obj, this.staticObjects);
    }

    return false;
  }

  killMutable(obj: BoardObject): boolean {
    if (this.kill(obj, this.map[obj.position.Y][obj.position.X])) {
      return this.kill(obj, this.mutableObjects);
    }

    return false;
  }

  addObject(obj: BoardObject) {
    this.map[obj.position.Y][obj.position.X].push(obj);
  }

  addStaticObject(obj: StaticObject): boolean {
    if (this.staticObjects.findIndex((o) => o.Id == obj.Id) == -1) {
      this.addObject(obj);
      this.staticObjects.push(obj);
      return true;
    }

    return false;
  }

  addMutableObject(obj: MutableObject): boolean {
    if (this.mutableObjects.findIndex((o) => o.Id == obj.Id) == -1) {
      this.addObject(obj);
      this.mutableObjects.push(obj);
      return true;
    }

    return false;
  }

  public get symbolMap(): string[][] {
    let result: string[][] = [];

    this.map.forEach((line, lineIndex) => {
      result[lineIndex] = [];

      line.forEach((column, columnIndex) => {
        if (column.length == 0) {
          result[lineIndex][columnIndex] = "0";
        } else {
          result[lineIndex][columnIndex] = column[column.length - 1].Symbol;
        }
      });
    });

    return result;
  }

  private move(obj: MutableObject, p: Point) {
    if (!obj.position.equals(p)) {
      let cell = this.map[p.Y][p.X];

      let collided = false;

      if (cell.length != 0) {
        collided = true;

        let colissions = obj.collide(cell);

        colissions.forEach((colission) =>
          this.colissions.push({ source: obj, target: colission, position: p })
        );
      }

      if (!collided) {
        if (this.kill(obj, this.map[obj.position.Y][obj.position.X])) {
          cell.push(obj);
          obj.position = p;
        }
      }
    }
  }

  act() {
    this.colissions = [];

    this.mutableObjects.forEach((obj) => {
      this.move(obj, obj.act());
    });

    this.processHit();
  }

  processHit() {
    if (this.colissions.length > 0) {
      this.colissions
        .filter((colission) =>
          colission.target.position.equals(colission.position)
        )
        .forEach((colission) => {
          colission.source.hitIt(colission.target);
          colission.target.hitBy(colission.source);
        });
    }
  }
}
