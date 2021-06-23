import { Board } from "./Board";
import { Point } from "./Point";

export abstract class BoardObject {
  public get Id() {
    return this.id;
  }

  public get Symbol() {
    return this.symbol;
  }

  protected board: Board | null;

  public get BoardId(): string | undefined {
    return this.board?.Id;
  }

  public set Board(board: Board) {
    this.board = board;
  }

  private isDead = false;

  public get IsDead() {
    return this.isDead;
  }

  public set Kill(isdead: boolean) {
    if (isdead) {
      this.board = null;
      this.isDead = true;
    }
  }

  /**
   *
   */
  constructor(
    private id: string,
    public position: Point,
    protected symbol: string = "#"
  ) {
    this.board = null;
  }

  abstract hitBy(object: BoardObject): void;
  abstract hitIt(object: BoardObject): void;

  abstract collide(object: BoardObject[]): BoardObject[];
}
