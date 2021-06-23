export class Counter {
  /**
   *
   */
  constructor(private counter: number = 0) {}

  public get next() {
    return this.counter++;
  }

  count(to: number, act: (index: number) => void) {
    while (this.next < to) {
      act(this.counter);
    }
  }
}
