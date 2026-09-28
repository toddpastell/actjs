import { Entity } from "./entity";
import monogramUrl from "./monogram.png";
import type { Renderer } from "./renderer";
import { Sheet } from "./sheet";

const FIRST_CHAR = 32;
const NEWLINE = 10;

export interface LabelOptions {
  x?: number;
  y?: number;
  fill?: number;
  layer?: number;
  fixed?: boolean;
}

export class Label extends Entity {
  static defaultOptions: LabelOptions = { fill: 0xffffff };

  text: string;
  fill: number;

  private readonly sheet = Sheet.from(monogramUrl, 6, 12);

  constructor(text: string, options: LabelOptions = {}) {
    super();

    const {
      x = 0,
      y = 0,
      fill = 0xffffff,
      layer = 0,
      fixed = false,
    } = { ...Label.defaultOptions, ...options };

    this.text = text;
    this.fill = fill;
    this.x = x;
    this.y = y;
    this.layer = layer;
    this.fixed = fixed;
  }

  draw(renderer: Renderer, cameraX: number, cameraY: number): void {
    const { sheet, text } = this;
    let column = 0;
    let row = 0;

    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);

      if (code === NEWLINE) {
        column = 0;
        row++;
        continue;
      }

      if (code !== FIRST_CHAR) {
        renderer.draw(
          sheet,
          code - FIRST_CHAR,
          this.x + column * sheet.cellWidth - cameraX,
          this.y + row * sheet.cellHeight - cameraY,
          false,
          this.fill,
        );
      }

      column++;
    }
  }
}
