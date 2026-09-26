import { Container } from "pixi.js";
import type { Actor } from "./actor";
import type { Game } from "./game";

export abstract class Scene extends Container {
  game!: Game;

  abstract init(): void;

  deinit(): void {}

  update(_deltaMS: number): void {}

  all<T extends Actor>(type: abstract new (...args: any[]) => T): T[] {
    return this.children.filter((child): child is T => child instanceof type);
  }
}
