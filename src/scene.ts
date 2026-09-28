import { Container } from "pixi.js";
import type { Game } from "./game";
import { Timers } from "./timers";

export abstract class Scene extends Container {
  game!: Game;
  readonly timers = new Timers();

  abstract init(): void;

  deinit(): void {}

  update(_deltaMS: number): void {}

  all<T extends Container>(type: abstract new (...args: any[]) => T): T[] {
    const found: T[] = [];

    const visit = (container: Container): void => {
      for (const child of container.children) {
        if (child instanceof type) found.push(child);
        visit(child);
      }
    };

    visit(this);
    return found;
  }
}
