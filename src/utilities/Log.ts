export class Log {
  static toLog = true;

  static print(...data: any[]) {
    if (this.toLog) {
      console.log(data);
    }
  }
}
