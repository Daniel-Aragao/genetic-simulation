import { Board } from "../models/Board";

export class ConsoleRenderer {
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
    console.clear();
    let map = this.board.symbolMap;

    let header = this.makeHeader();

    let decimals = this.padSize;
    console.log(header);

    for (let i = 0; i < this.board.Height; i++) {
      let str = i.toString().padStart(decimals, " ") + " ";

      for (let j = 0; j < this.board.Width; j++) {
        str +=
          (map[i][j] == "0" ? " " : map[i][j]).padStart(decimals, " ") + " ";
      }

      console.log(str);
    }
  }

  private makeHeader() {
    let decimals = this.padSize;

    let str = "   ".padStart(decimals, " ");

    for (let i = 0; i < this.board.Width; i++) {
      str += i.toString().padStart(decimals, " ") + " ";
    }

    return str;
  }
}
