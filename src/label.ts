import { BitmapText, type ColorSource } from "pixi.js";
import { MONOGRAM, MONOGRAM_SIZE } from "./font";

export interface LabelOptions {
  x?: number;
  y?: number;
  fill?: ColorSource;
}

export class Label extends BitmapText {
  static defaultOptions: LabelOptions = { fill: 0xffffff };

  constructor(text: string, options: LabelOptions = {}) {
    const { x, y, fill } = { ...Label.defaultOptions, ...options };

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
