import { BoardObject } from "../BoardObject";
import { Point } from "../Point";

export abstract class MutableObject extends BoardObject {
  abstract act(): Point;
}
