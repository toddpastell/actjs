import { Actor, collide, Game, Label, Scene, Sheet, Tilemap } from "actjs";
import { Container } from "pixi.js";
import mouseUrl from "./mouse.png";
import worldUrl from "./world.png";

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
    const [level] = this.scene.all(Tilemap);

    level.move(this, input.x * SPEED * deltaMS, input.y * SPEED * deltaMS);

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
  private readonly actors = new Container();
  private readonly ui = new Container();

  init(): void {
    const { width, height } = this.game.app.screen;
    const player = new Player();
    const statue = new Statue();

    const level = new Tilemap(
      Sheet.from(worldUrl, 8),
      [
        "####################",
        "#..................#",
        "#..................#",
        "#..................#",
        "#.....##...........#",
        "#.....##.......#...#",
        "#..............#...#",
        "#..............#...#",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..........####....#",
        "#...().............#",
        "#..(==)........()..#",
        "#==================#",
        "#==================#",
        "####################",
      ],
      { tiles: { "#": 1, "(": 2, ")": 3, "=": 4 }, solid: "#=" },
    );

    player.position.set(width / 2, height / 2);
    statue.position.set(width / 2 - 24, height / 2);

    this.addChild(level, this.actors, this.ui);
    this.actors.addChild(statue, player);
    const label = new Label("hello, mouse!", { x: 12, y: 8 });
    this.ui.addChild(label);

    const stop = this.timers.every(250, () => {
      label.visible = !label.visible;
    });

    this.timers.after(3000, () => {
      stop();
      label.visible = true;
      label.text = "go explore!";
    });
  }
}

Label.defaultOptions.fill = PALETTE.lightest;

const game = new Game();
await game.init({
  background: PALETTE.dark,
  assets: [mouseUrl, worldUrl],
});
game.load(new Example());
