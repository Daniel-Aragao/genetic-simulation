export class Log {
  static toLog = true;
  static priority = 0;

  static print(...data: any[]) {
    if (this.toLog && this.priority <= 0) {
      console.log(...data);
    }
  }

  static print1(...data: any[]) {
    if (this.toLog && this.priority <= 1) {
      console.log(...data);
    }
  }

  static print2(...data: any[]) {
    if (this.toLog && this.priority <= 2) {
      console.log(...data);
    }
  }
}
