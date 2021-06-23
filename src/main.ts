import { Log } from "./utilities/Log";
import { Board } from "./models/Board";
import { Goop } from "./models/mutableObjects/Goop";
import { Point } from "./models/Point";
import { ConsoleRenderer } from "./utilities/ConsoleRenderer";
import { Counter } from "./utilities/Counter";
import { Random } from "./utilities/Random";

let width = 40;
let height = 40;
let goops = 2;
let iterations = 500;
let fps = 10;
Log.toLog = false;

let board = new Board(width, height, true);
let renderer = new ConsoleRenderer(board);

let creatureCounter = new Counter(1);

new Counter().count(10, (i) => {
  let x = Random.getRandomInt(1, width - 1);
  let y = Random.getRandomInt(1, height - 1);

  let goop = new Goop(creatureCounter.next, new Point(x, y), i.toString());
  board.addMutableObject(goop);
});

let gameCounter = new Counter(1);

let intId = setInterval(() => {
  if (gameCounter.next < iterations) {
    renderer.render();
    board.act();
  } else {
    clearInterval(intId);
  }
}, 1000 / fps);
