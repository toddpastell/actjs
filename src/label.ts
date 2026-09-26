import { BitmapText, type ColorSource } from "pixi.js";
import { MONOGRAM, MONOGRAM_SIZE } from "./font";

export interface LabelOptions {
  x?: number;
  y?: number;
  fill?: ColorSource;
}

export class Label extends BitmapText {
  constructor(text: string, options: LabelOptions = {}) {
    super({
      text,
      style: {
        fontFamily: MONOGRAM,
        fontSize: MONOGRAM_SIZE,
        fill: options.fill ?? 0xffffff,
      },
    });
    this.position.set(options.x ?? 0, options.y ?? 0);
  }
}
