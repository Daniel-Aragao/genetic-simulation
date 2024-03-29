import { Counter } from "../utilities/Counter";
import { GUIDGenerator } from "../utilities/GUIDGenerator";
import { Log } from "../utilities/Log";
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
  private hits: Collision[] = [];

  private map: BoardObject[][][] = [];
  private id: string;
  public sizeSuperiority: number = 0;

  public get Id() {
    return this.id;
  }
  /**
   *
   */
  constructor(
    private width: number,
    private height: number,
    walls: boolean = false
  ) {
    this.resetMap(walls);
    this.id = GUIDGenerator.guid;
    this.addObject.bind(this);
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

  public isCellEmpty(p: Point) {
    return this.map[p.Y][p.X].length == 0;
  }

  private Splice(obj: BoardObject, objs: BoardObject[]) {
    var index = objs.findIndex((o) => o.Id == obj.Id);

    if (index == -1) return false;

    objs.splice(index, 1);

    return true;
  }

  private killStatic(obj: StaticObject): boolean {
    if (this.Splice(obj, this.map[obj.position.Y][obj.position.X])) {
      return this.Splice(obj, this.staticObjects);
    }

    return false;
  }

  private killMutable(obj: MutableObject): boolean {
    if (this.Splice(obj, this.map[obj.position.Y][obj.position.X])) {
      return this.Splice(obj, this.mutableObjects);
    }

    return false;
  }

  killObject(obj: BoardObject): boolean {
    var result = false;

    if (this.staticObjects.findIndex((o) => o.Id == obj.Id) >= 0) {
      result = this.killStatic(obj as StaticObject);
    } else if (this.mutableObjects.findIndex((o) => o.Id == obj.Id) >= 0) {
      result = this.killMutable(obj as MutableObject);
    }

    obj.Kill = result;

    return result;
  }

  private addObject(obj: BoardObject) {
    this.map[obj.position.Y][obj.position.X].push(obj);
    obj.Board = this;
    Log.print(obj.BoardId);
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

  public getCell(i: number, j: number): BoardObject[] | null {
    if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
      return this.map[i][j];
    }

    return null;
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

  private move(obj: MutableObject, newPosition: Point) {
    let cell = this.map[newPosition.Y]?.[newPosition.X];

    if (!cell) return;

    let collided = false;

    if (!obj.position.equals(newPosition)) {
      if (cell.length != 0) {
        let colissions = obj.collide(cell);

        if (colissions.length > 0) {
          collided = true;
        }

        colissions.forEach((colission) =>
          this.hits.push({
            source: obj,
            target: colission,
            position: newPosition,
          })
        );
      }
    }

    if (!collided) {
      if (this.Splice(obj, this.map[obj.position.Y][obj.position.X])) {
        cell.forEach((i) => {
          if (obj.Id != i.Id) {
            this.hits.push({ source: obj, target: i, position: newPosition });
          }
        });

        cell.push(obj);
        obj.position = newPosition;
      }
    }
  }

  act() {
    this.hits = [];

    this.mutableObjects.forEach((obj) => {
      this.move(obj, obj.act());
    });

    this.processHit();
  }

  processHit() {
    if (this.hits.length > 0) {
      this.hits
        .filter((hit) => hit.target.position.equals(hit.position))
        .forEach((hit) => {
          Log.print(
            `Hit : ${this.Id} : ${hit.source.BoardId} : ${hit.source.Id}=>${hit.target.Id} : ${hit.target.BoardId}`
          );

          if (hit.target.BoardId == this.Id) {
            hit.source.hitIt(hit.target);
            hit.target.hitBy(hit.source);
          }
        });
    }
  }
}
