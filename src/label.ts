import { BitmapText, type ColorSource } from "pixi.js";
import { MONOGRAM, MONOGRAM_SIZE } from "./font";

export interface LabelOptions {
  x?: number;
  y?: number;
  fill?: ColorSource;
}

export class Label extends BitmapText {
  constructor(text: string, { x, y, fill = 0xffffff }: LabelOptions = {}) {
    super({
      text,
      x,
      y,
      style: {
        fontFamily: MONOGRAM,
        fontSize: MONOGRAM_SIZE,
        fill,
      },
    });
  }
}
