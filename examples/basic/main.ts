import { Actor, collide, Game, Label, Scene, Sheet } from "actjs";
import mouseUrl from "./mouse.png";

const PALETTE = {
  darkest: 0x306141,
  dark: 0x49a269,
  light: 0x71e392,
  lightest: 0xa2ffcb,
} as const;

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

    for (const statue of this.scene.all(Statue)) collide(statue, this);

    if (input.x !== 0) this.scale.x = input.x;

    this.play(input.x || input.y ? "walk" : "idle");
  }
}

class Statue extends Actor<"idle"> {
  constructor() {
    super(Sheet.from(mouseUrl, 8), { idle: { frames: [0] } }, "idle");
  }
}

class Example extends Scene {
  init(): void {
    const { width, height } = this.game.app.screen;
    const player = new Player();
    const statue = new Statue();

    player.position.set(width / 2, height / 2);
    statue.position.set(width / 2 - 24, height / 2);

    this.addChild(statue, player);

    this.addChild(new Label("hello, mouse!", { x: 4, y: 2 }));
  }
}

Label.defaultOptions.fill = PALETTE.lightest;

const game = new Game();
await game.init({
  background: PALETTE.dark,
  assets: [mouseUrl],
});
game.load(new Example());
