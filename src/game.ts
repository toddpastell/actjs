import { Actor } from "./actor";
import { load } from "./assets";
import type { Entity } from "./entity";
import { Input } from "./input";
import monogramUrl from "./monogram.png";
import { Renderer } from "./renderer";
import type { Scene } from "./scene";

export interface GameOptions {
  width?: number;
  height?: number;
  background?: number;
  assets?: string[];
}

const byLayer = (a: Entity, b: Entity): number => a.layer - b.layer;

export class Game {
  readonly canvas = document.createElement("canvas");
  readonly input = new Input();

  background = 0x000000;

  private renderer!: Renderer;
  private current: Scene | null = null;
  private last = 0;
  private handle = 0;

  get width(): number {
    return this.canvas.width;
  }

  get height(): number {
    return this.canvas.height;
  }

  async init({
    width = 160,
    height = 144,
    background = 0x000000,
    assets = [],
  }: GameOptions = {}): Promise<void> {
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.imageRendering = "pixelated";
    this.background = background;
    this.renderer = new Renderer(this.canvas);

    document.body.appendChild(this.canvas);

    await load([...assets, monogramUrl]);

    this.input.init();

    window.addEventListener("resize", this.onResize);
    this.onResize();

    this.last = performance.now();
    this.handle = requestAnimationFrame(this.frame);
  }

  deinit(): void {
    cancelAnimationFrame(this.handle);
    this.input.deinit();
    window.removeEventListener("resize", this.onResize);

    this.unload();
    this.canvas.remove();
  }

  switch(next: Scene): void {
    this.unload();

    this.current = next;
    next.game = this;
    next.init();
  }

  private unload(): void {
    const scene = this.current;
    if (!scene) return;

    for (const entity of scene.entities) entity.deinit();

    scene.deinit();
    this.current = null;
  }

  private frame = (time: number): void => {
    const deltaMS = Math.min(time - this.last, 100);
    this.last = time;

    this.update(deltaMS);
    this.render();

    this.handle = requestAnimationFrame(this.frame);
  };

  private update(deltaMS: number): void {
    this.input.poll();

    const scene = this.current;
    if (!scene) return;

    for (const entity of scene.entities) {
      if (entity.removed) continue;

      if (entity instanceof Actor) {
        entity.timers.update(deltaMS);
        entity.update(deltaMS);
        entity.animate(deltaMS);
      } else {
        entity.update(deltaMS);
      }
    }

    scene.timers.update(deltaMS);
    scene.update(deltaMS);
    scene.prune();
  }

  private render(): void {
    const { renderer } = this;

    renderer.begin(this.background);

    const scene = this.current;

    if (scene) {
      const cameraX = Math.round(scene.camera.x);
      const cameraY = Math.round(scene.camera.y);

      scene.entities.sort(byLayer);

      for (const entity of scene.entities) {
        if (!entity.visible) continue;

        if (entity.fixed) entity.draw(renderer, 0, 0);
        else entity.draw(renderer, cameraX, cameraY);
      }
    }

    renderer.end();
  }

  private onResize = (): void => {
    const scale = Math.max(
      1,
      Math.floor(
        Math.min(
          window.innerWidth / this.width,
          window.innerHeight / this.height,
        ),
      ),
    );
    this.canvas.style.width = `${this.width * scale}px`;
    this.canvas.style.height = `${this.height * scale}px`;
  };
}
