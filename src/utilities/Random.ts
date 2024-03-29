export class Random {
  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}
