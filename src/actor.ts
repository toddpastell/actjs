import { Entity } from "./entity";
import { Rect } from "./rect";
import type { Renderer } from "./renderer";
import type { Sheet } from "./sheet";

export type Animation = {
  frames: number[];
  speed?: number;
};

export abstract class Actor<State extends string = string> extends Entity {
  protected readonly sheet: Sheet;
  protected readonly animations: Record<State, Animation>;

  state: State;
  frame = 0;
  flip = false;
  body: Rect;

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
    this.body = new Rect(
      -sheet.cellWidth / 2,
      -sheet.cellHeight / 2,
      sheet.cellWidth,
      sheet.cellHeight,
    );
  }

  play(state: State) {
    if (state === this.state) return;

    this.state = state;
    this.frame = 0;
    this.elapsed = 0;
  }

  animate(deltaMS: number) {
    const animation = this.animations[this.state];
    const speed = animation.speed ?? 100;

    this.elapsed += deltaMS;

    if (this.elapsed < speed) return;

    this.elapsed -= speed;
    this.frame = (this.frame + 1) % animation.frames.length;
  }

  draw(renderer: Renderer, cameraX: number, cameraY: number): void {
    const { cellWidth, cellHeight } = this.sheet;

    renderer.draw(
      this.sheet,
      this.animations[this.state].frames[this.frame],
      this.x - cellWidth / 2 - cameraX,
      this.y - cellHeight / 2 - cameraY,
      this.flip,
    );
  }
}
