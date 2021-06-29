import { Log } from "./utilities/Log";
import { Board } from "./models/Board";
import { Goop } from "./models/mutableObjects/Goop";
import { Point } from "./models/Point";
import { ConsoleRenderer } from "./utilities/ConsoleRenderer";
import { Counter } from "./utilities/Counter";
import { Random } from "./utilities/Random";
import { Coin } from "./models/staticObjects/Coin";

// Setup ================================================================================================
let width = 50;
let height = 40;
let iterations = 500;
let fps = 10;
let coinDensity = 0.025;
let coinsNumber = parseInt((width * height * coinDensity).toString());
let sizeSuperiority = 1.2;
let sense = 3;
let size = 1;
let step = 1;
let goopsQuantity = 16;
let collectLimit = 0;

// Log and rendering ====================================================================================
let render = true;
Log.toLog = true;
Log.priority = 1;

// Creating population and board ========================================================================
let board = new Board(width, height, true);
board.sizeSuperiority = sizeSuperiority;

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

// Creating info extraction functions ===================================================================

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

// Game loop ============================================================================================
var remainingCoins = coinsNumber;

let renderer = new ConsoleRenderer(board);
let gameCounter = new Counter(1);

let intId = setInterval(() => {
  if (gameCounter.next < iterations && remainingCoins) {
    if (render) {
      renderer.render();
    }
    remainingCoins = coinsInfo();
    Log.print1(`Iterations: ${gameCounter.current}/${iterations}`);
    goopsInfo();
    board.act();
  } else {
    // coinsInfo();
    clearInterval(intId);
  }
}, 1000 / fps);
