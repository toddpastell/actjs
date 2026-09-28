import { Container, Sprite } from "pixi.js";
import type { Actor } from "./actor";
import type { Sheet } from "./sheet";

export interface TilemapOptions {
  tiles: Record<string, number>;
  solid?: string;
}

export class Tilemap extends Container {
  readonly sheet: Sheet;
  readonly rows: string[];

  private readonly solid: string;

  constructor(
    sheet: Sheet,
    rows: string[],
    { tiles, solid = "" }: TilemapOptions,
  ) {
    super();

    this.sheet = sheet;
    this.rows = rows;
    this.solid = solid;

    for (let row = 0; row < rows.length; row++) {
      for (let column = 0; column < rows[row].length; column++) {
        const index = tiles[rows[row][column]];
        if (index === undefined) continue;

        this.addChild(
          new Sprite({
            texture: sheet.cell(index),
            x: column * sheet.cellWidth,
            y: row * sheet.cellHeight,
          }),
        );
      }
    }
  }

  at(x: number, y: number): string | undefined {
    const column = Math.floor(x / this.sheet.cellWidth);
    const row = Math.floor(y / this.sheet.cellHeight);

    return this.rows[row]?.[column];
  }

  touches({ x, y, body }: Actor, chars: string): boolean {
    const { cellWidth, cellHeight } = this.sheet;

    const left = Math.floor((x + body.left) / cellWidth);
    const right = Math.ceil((x + body.right) / cellWidth);
    const top = Math.floor((y + body.top) / cellHeight);
    const bottom = Math.ceil((y + body.bottom) / cellHeight);

    for (let row = top; row < bottom; row++) {
      for (let column = left; column < right; column++) {
        const char = this.rows[row]?.[column];
        if (char !== undefined && chars.includes(char)) return true;
      }
    }

    return false;
  }

  move(actor: Actor, dx: number, dy: number): void {
    const { body } = actor;
    const { cellWidth, cellHeight } = this.sheet;

    actor.x += dx;

    if (dx !== 0 && this.touches(actor, this.solid)) {
      const edge = actor.x + (dx > 0 ? body.right : body.left);
      const snap = dx > 0 ? Math.floor : Math.ceil;

      actor.x += snap(edge / cellWidth) * cellWidth - edge;
    }

    actor.y += dy;

    if (dy !== 0 && this.touches(actor, this.solid)) {
      const edge = actor.y + (dy > 0 ? body.bottom : body.top);
      const snap = dy > 0 ? Math.floor : Math.ceil;

      actor.y += snap(edge / cellHeight) * cellHeight - edge;
    }
  }
}
