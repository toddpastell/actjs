interface Timer {
  delay: number;
  remaining: number;
  repeat: boolean;
  callback: () => void;
}

export class Timers {
  private readonly timers = new Set<Timer>();

  after(delay: number, callback: () => void): () => void {
    return this.add(delay, false, callback);
  }

  every(delay: number, callback: () => void): () => void {
    return this.add(delay, true, callback);
  }

  update(deltaMS: number): void {
    for (const timer of this.timers) {
      timer.remaining -= deltaMS;

      if (timer.remaining > 0) continue;

      if (timer.repeat) timer.remaining += timer.delay;
      else this.timers.delete(timer);

      timer.callback();
    }
  }

  private add(
    delay: number,
    repeat: boolean,
    callback: () => void,
  ): () => void {
    const timer = { delay, remaining: delay, repeat, callback };

    this.timers.add(timer);

    return () => this.timers.delete(timer);
  }
}
