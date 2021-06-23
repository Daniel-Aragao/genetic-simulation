import { Log } from "./utilities/Log";
import { Board } from "./models/Board";
import { Goop } from "./models/mutableObjects/Goop";
import { Point } from "./models/Point";
import { ConsoleRenderer } from "./utilities/ConsoleRenderer";
import { Counter } from "./utilities/Counter";
import { Random } from "./utilities/Random";
import { Coin } from "./models/staticObjects/Coin";

let width = 40;
let height = 40;
let iterations = 500;
let fps = 10;
let coinDensity = 0.025;
let coinNumber = parseInt((width * height * coinDensity).toString());
let sizeSuperiority = 1.2;
let sense = 3;
let size = 1;
let step = 1;
let goopsQuantity = 1;
let collectLimit = 0;

let render = true;
Log.toLog = true;
Log.priority = 2;

let board = new Board(width, height, true);
board.sizeSuperiority = sizeSuperiority;

let renderer = new ConsoleRenderer(board);

let goopsList: Goop[] = [];

new Counter().count(goopsQuantity, (i) => {
  let x = Random.getRandomInt(1, width - 1);
  let y = Random.getRandomInt(1, height - 1);

  let goop = new Goop(i, new Point(x, y), {
    sense: sense,
    size: size,
    step: step,
  }); //, i.toString());
  goop.collectionLimit = collectLimit;
  board.addMutableObject(goop);

  goopsList.push(goop);
});

new Counter().count(coinNumber, (i) => {
  let x = Random.getRandomInt(1, width - 1);
  let y = Random.getRandomInt(1, height - 1);

  let coin = new Coin(i, new Point(x, y));
  board.addStaticObject(coin);
});

let gameCounter = new Counter(1);

function coinsInfo() {
  let coins = 0;

  goopsList.forEach((goop) => {
    coins += goop.Collection.filter((o) => o.Id.startsWith("#Coin")).length;
  });

  Log.print1(`Coins: ${coins}/${coinNumber}`);
}

let intId = setInterval(() => {
  if (gameCounter.next < iterations) {
    if (render) {
      renderer.render();
    }
    coinsInfo();
    board.act();
  } else {
    coinsInfo();
    clearInterval(intId);
  }
}, 1000 / fps);
