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
  }

  update(deltaMS: number): void {
    const { input } = this.game;

    this.x += input.x * SPEED * deltaMS;
    this.y += input.y * SPEED * deltaMS;

    if (input.x !== 0) this.scale.x = input.x;

    this.play(input.x || input.y ? "walk" : "idle");
  }
}

class Example extends Scene {
  init(): void {
    const { width, height } = this.game.app.screen;
    const player = new Player();

    player.position.set(width / 2, height / 2);
    this.addChild(player);

    this.addChild(new Label("hello, mouse!", { x: 4, y: 2 }));
  }
}

const game = new Game();
await game.init({ assets: [mouseUrl] });
game.load(new Example());
