import { Container } from "pixi.js";
import type { Game } from "./game";

export abstract class Scene extends Container {
  game!: Game;

  abstract init(): void;

  deinit(): void {}

  update(_deltaMS: number): void {}
}
