import { Rectangle, Sprite } from "pixi.js";
import type { Game } from "./game";
import type { Scene } from "./scene";
import { Sheet } from "./sheet";

export type Animation = {
  frames: number[];
  speed?: number;
};

export abstract class Actor<State extends string = string> extends Sprite {
  protected readonly sheet: Sheet;
  protected readonly animations: Record<State, Animation>;

  state: State;
  frame = 0;
  body: Rectangle;

  private elapsed = 0;

  constructor(
    sheet: Sheet,
    animations: Record<State, Animation>,
    initialState: State,
  ) {
    super();

    this.sheet = sheet;
    this.animations = animations;
    this.state = initialState;
    this.body = new Rectangle(
      -sheet.cellWidth / 2,
      -sheet.cellHeight / 2,
      sheet.cellWidth,
      sheet.cellHeight,
    );

    this.anchor.set(0.5);
    this.updateTexture();
  }

  get scene(): Scene {
    return this.parent as Scene;
  }

  get game(): Game {
    return this.scene.game;
  }

  update(_deltaMS: number): void {}

  play(state: State) {
    if (state === this.state) return;

    this.state = state;
    this.frame = 0;
    this.elapsed = 0;

    this.updateTexture();
  }

  animate(deltaMS: number) {
    const animation = this.animations[this.state];
    const speed = animation.speed ?? 100;

    this.elapsed += deltaMS;

    if (this.elapsed < speed) return;

    this.elapsed -= speed;
    this.frame = (this.frame + 1) % animation.frames.length;

    this.updateTexture();
  }

  private updateTexture() {
    const animation = this.animations[this.state];
    this.texture = this.sheet.cell(animation.frames[this.frame]);
  }
}
