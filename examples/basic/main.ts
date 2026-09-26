import { Actor, Game, Label, Scene, Sheet } from "actjs";
import mouseUrl from "./mouse.png";

const SPEED = 0.05;

class Player extends Actor<"idle" | "walk"> {
  constructor() {
    super(
      Sheet.from(mouseUrl, 8),
      {
        idle: { frames: [0, 1], speed: 400 },
        walk: { frames: [5, 6, 7, 8, 9] },
      },
      "idle",
    );

    this.anchor.set(0.5);
  }

  move(x: number, y: number, deltaMS: number): void {
    this.x += x * SPEED * deltaMS;
    this.y += y * SPEED * deltaMS;

    if (x !== 0) this.scale.x = x;

    this.play(x || y ? "walk" : "idle");
  }
}

class Example extends Scene {
  private player!: Player;

  init(): void {
    const { width, height } = this.game.app.screen;

    this.player = new Player();
    this.player.position.set(width / 2, height / 2);
    this.addChild(this.player);

    this.addChild(new Label("hello, mouse!", { x: 4, y: 2 }));
  }

  update(deltaMS: number): void {
    const { input } = this.game;

    this.player.move(input.x, input.y, deltaMS);
  }
}

const game = new Game();
await game.init({ assets: [mouseUrl] });
game.load(new Example());
