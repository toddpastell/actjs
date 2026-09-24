import { Application, TextureStyle, Ticker } from "pixi.js";
import { Input } from "./input";
import { Scene } from "./scene";

export interface GameOptions {
  width?: number;
  height?: number;
}

export class Game {
  readonly app = new Application();
  readonly input = new Input();

  private readonly width: number;
  private readonly height: number;
  private current: Scene | null = null;

  constructor({ width = 320, height = 180 }: GameOptions = {}) {
    this.width = width;
    this.height = height;
  }

  async init(): Promise<void> {
    TextureStyle.defaultOptions.scaleMode = "nearest";

    await this.app.init({
      width: this.width,
      height: this.height,
      antialias: false,
    });

    document.body.appendChild(this.app.canvas);

    this.app.ticker.add(this.tick);
    this.input.init();

    window.addEventListener("resize", this.onResize);
    this.onResize();
  }

  deinit(): void {
    this.app.ticker.remove(this.tick);
    this.input.deinit();
    window.removeEventListener("resize", this.onResize);

    this.unload();
    this.app.destroy(true, { children: true });
  }

  load(next: Scene): void {
    if (next.destroyed) throw new Error("Scene destroyed");

    this.unload();

    this.current = next;
    next.game = this;
    this.app.stage.addChild(next);
    next.init();
  }

  private unload(): void {
    if (!this.current) return;

    try {
      this.current.deinit();
    } finally {
      this.current.destroy({ children: true });
      this.current = null;
    }
  }

  private tick = (ticker: Ticker): void => {
    this.input.poll();
    this.current?.update(ticker.deltaMS);
  };

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
    this.app.canvas.style.width = `${this.width * scale}px`;
    this.app.canvas.style.height = `${this.height * scale}px`;
  };
}
