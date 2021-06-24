import { Log } from "./utilities/Log";
import { Board } from "./models/Board";
import { Goop } from "./models/mutableObjects/Goop";
import { Point } from "./models/Point";
import { ConsoleRenderer } from "./utilities/ConsoleRenderer";
import { Counter } from "./utilities/Counter";
import { Random } from "./utilities/Random";
import { Coin } from "./models/staticObjects/Coin";

let width = 50;
let height = 50;
let iterations = 500;
let fps = 5;
let coinDensity = 0.025;
let coinsNumber = parseInt((width * height * coinDensity).toString());
let sizeSuperiority = 1.2;
let sense = 3;
let size = 1;
let step = 1;
let goopsQuantity = 15;
let collectLimit = 0;

let render = true;
Log.toLog = true;
Log.priority = 1;

let board = new Board(width, height, true);
board.sizeSuperiority = sizeSuperiority;

let renderer = new ConsoleRenderer(board);

let goopsList: Goop[] = [];

new Counter().count(goopsQuantity, (i) => {
  let x = Random.getRandomInt(1, width - 1);
  let y = Random.getRandomInt(1, height - 1);

  let goop = new Goop(i, new Point(x, y), {
    sense: sense,
    size: Random.getRandomInt(size, 3),
    step: Random.getRandomInt(step, 3),
  });
  goop.collectionLimit = collectLimit;
  board.addMutableObject(goop);

  goopsList.push(goop);
});

new Counter().count(coinsNumber, (i) => {
  let x = Random.getRandomInt(1, width - 1);
  let y = Random.getRandomInt(1, height - 1);

  let coin = new Coin(i, new Point(x, y));
  board.addStaticObject(coin);
});

let gameCounter = new Counter(1);

function coinsInfo(): number {
  let coins = 0;

  goopsList.forEach((goop) => {
    coins += goop.CoinsCollected;
  });

  Log.print1(`Coins: ${coins}/${coinsNumber}`);

  return coinsNumber - coins;
}

function goopsInfo() {
  var line = "";
  var lineSize = width * 3;

  goopsList.forEach((goop) => {
    let txt = `${goop.Id}(${goop.position.X.toString().padStart(
      2,
      " "
    )}, ${goop.position.Y.toString().padStart(
      2,
      " "
    )})[${goop.AcquiredAmount.toString().padStart(
      3,
      " "
    )}/${goop.LostAmount.toString().padStart(
      3,
      " "
    )}/${goop.CoinsCollected.toString().padStart(3, " ")}] `;

    if (txt.length + line.length > lineSize) {
      Log.print1(line);
      line = txt;
    } else {
      line += txt;
    }
  });

  if (line) {
    Log.print1(line);
  }
}

var remainingCoins = coinsNumber;

let intId = setInterval(() => {
  if (gameCounter.next < iterations && remainingCoins) {
    if (render) {
      renderer.render();
    }
    remainingCoins = coinsInfo();
    goopsInfo();
    board.act();
  } else {
    // coinsInfo();
    clearInterval(intId);
  }
}, 1000 / fps);
