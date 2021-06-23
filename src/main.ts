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
let goops = 2;
let iterations = 500;
let fps = 10;
let coinDensity = 0.025;
let coinNumber = parseInt((width * height * coinDensity).toString());
let render = true;
Log.toLog = false;

let board = new Board(width, height, true);
let renderer = new ConsoleRenderer(board);

let goopsList: Goop[] = [];

new Counter().count(10, (i) => {
  let x = Random.getRandomInt(1, width - 1);
  let y = Random.getRandomInt(1, height - 1);

  let goop = new Goop(i, new Point(x, y)); //, i.toString());
  goop.collectionLimit = 4;
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

  console.log(`Coins: ${coins}/${coinNumber}`);
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
