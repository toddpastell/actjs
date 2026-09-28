import type { Renderer } from "./renderer";
import type { Scene } from "./scene";

export abstract class Entity {
  scene!: Scene;

  x = 0;
  y = 0;
  layer = 0;
  fixed = false;
  visible = true;
  removed = false;

  init(): void {}

  deinit(): void {}

  update(_deltaMS: number): void {}

  abstract draw(renderer: Renderer, cameraX: number, cameraY: number): void;
}
