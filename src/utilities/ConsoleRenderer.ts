import { Board } from "../models/Board";

export class ConsoleRenderer {
  private str = "";
  /**
   *
   */
  constructor(private board: Board) {}

  private get padSize() {
    return (
      this.board.Width > this.board.Height
        ? this.board.Width
        : this.board.Height
    ).toString().length;
  }

  render() {
    this.str = "";
    let map = this.board.symbolMap;

    let header = this.makeHeader();

    let decimals = this.padSize;
    this.log(header);

    for (let i = 0; i < this.board.Height; i++) {
      let str =
        TermianlColor.FgCyan +
        i.toString().padStart(decimals, " ") +
        " " +
        TermianlColor.Reset;

      for (let j = 0; j < this.board.Width; j++) {
        str +=
          (map[i][j] == "0" ? " " : map[i][j]).padStart(decimals, " ") + " ";
      }

      this.log(str);
    }

    this.logMemory(header.length);

    this.log();

    console.clear();
    this.flush();
  }

  private logMemory(lineSize: number) {
    let memoryUsage = process.memoryUsage();

    let memory = `${(
      memoryUsage.heapUsed / 1000
    ).toFixed()}kB/${this.percentage(
      memoryUsage.heapUsed,
      memoryUsage.heapTotal
    )}/${this.percentage(memoryUsage.heapUsed, memoryUsage.rss)}`;

    memory = TermianlColor.FgYellow + memory + TermianlColor.Reset;

    this.log(memory.padStart(lineSize, " "));
  }

  private percentage(min: number, max: number): string {
    return ((min / max) * 100).toFixed(1) + "%";
  }

  private log(txt: string = "") {
    this.str += txt + "\n";
  }

  private flush() {
    console.log(this.str);
    this.str = "";
  }

  private makeHeader() {
    let decimals = this.padSize;

    let str = "   ".padStart(decimals, " ");

    for (let i = 0; i < this.board.Width; i++) {
      str += i.toString().padStart(decimals, " ") + " ";
    }

    return TermianlColor.FgCyan + str + TermianlColor.Reset;
  }
}

export enum TermianlColor {
  Reset = "\x1b[0m",
  Bright = "\x1b[1m",
  Dim = "\x1b[2m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
  Hidden = "\x1b[8m",

  FgBlack = "\x1b[30m",
  FgRed = "\x1b[31m",
  FgGreen = "\x1b[32m",
  FgYellow = "\x1b[33m",
  FgBlue = "\x1b[34m",
  FgMagenta = "\x1b[35m",
  FgCyan = "\x1b[36m",
  FgWhite = "\x1b[37m",

  BgBlack = "\x1b[40m",
  BgRed = "\x1b[41m",
  BgGreen = "\x1b[42m",
  BgYellow = "\x1b[43m",
  BgBlue = "\x1b[44m",
  BgMagenta = "\x1b[45m",
  BgCyan = "\x1b[46m",
  BgWhite = "\x1b[47m",
}
