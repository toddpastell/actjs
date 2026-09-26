import { Application, Assets, TextureStyle, Ticker } from "pixi.js";
import { Input } from "./input";
import { Scene } from "./scene";

export interface GameOptions {
  width?: number;
  height?: number;
  assets?: string[];
}

export class Game {
  readonly app = new Application();
  readonly input = new Input();

  private current: Scene | null = null;

  async init({
    width = 160,
    height = 144,
    assets = [],
  }: GameOptions = {}): Promise<void> {
    TextureStyle.defaultOptions.scaleMode = "nearest";

    await this.app.init({
      width,
      height,
      antialias: false,
    });

    document.body.appendChild(this.app.canvas);

    await Assets.load(assets);
    // todo load font

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
    const { width, height } = this.app.screen;
    const scale = Math.max(
      1,
      Math.floor(
        Math.min(window.innerWidth / width, window.innerHeight / height),
      ),
    );
    this.app.canvas.style.width = `${width * scale}px`;
    this.app.canvas.style.height = `${height * scale}px`;
  };
}
