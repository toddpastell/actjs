import type { Actor } from "./actor";
import { Entity } from "./entity";
import type { Renderer } from "./renderer";
import type { Sheet } from "./sheet";

export interface TilemapOptions {
  legend: Record<string, number>;
  solid?: string;
}

export class Tilemap extends Entity {
  readonly sheet: Sheet;
  readonly map: string[];
  readonly columns: number;
  readonly rows: number;

  private readonly solid: string;
  private readonly cells: Int16Array;

  constructor(
    sheet: Sheet,
    map: string[],
    { legend, solid = "" }: TilemapOptions,
  ) {
    super();

    this.sheet = sheet;
    this.map = map;
    this.solid = solid;
    this.columns = map[0].length;
    this.rows = map.length;
    this.cells = new Int16Array(this.columns * this.rows).fill(-1);

    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        const index = legend[map[row][column]];
        if (index !== undefined)
          this.cells[row * this.columns + column] = index;
      }
    }
  }

  get width(): number {
    return this.columns * this.sheet.cellWidth;
  }

  get height(): number {
    return this.rows * this.sheet.cellHeight;
  }

  at(x: number, y: number): string | undefined {
    const column = Math.floor(x / this.sheet.cellWidth);
    const row = Math.floor(y / this.sheet.cellHeight);

    return this.map[row]?.[column];
  }

  touches({ x, y, body }: Actor, chars: string): boolean {
    const { cellWidth, cellHeight } = this.sheet;

    const left = Math.floor((x + body.left) / cellWidth);
    const right = Math.ceil((x + body.right) / cellWidth);
    const top = Math.floor((y + body.top) / cellHeight);
    const bottom = Math.ceil((y + body.bottom) / cellHeight);

    for (let row = top; row < bottom; row++) {
      for (let column = left; column < right; column++) {
        const char = this.map[row]?.[column];
        if (char !== undefined && chars.includes(char)) return true;
      }
    }

    return false;
  }

  move(actor: Actor, dx: number, dy: number): void {
    this.moveX(actor, dx);
    this.moveY(actor, dy);
  }

  moveX(actor: Actor, dx: number): boolean {
    const steps = Math.floor(Math.abs(dx) / this.sheet.cellWidth) + 1;

    for (let i = 0; i < steps; i++) {
      if (this.stepX(actor, dx / steps)) return true;
    }

    return false;
  }

  moveY(actor: Actor, dy: number): boolean {
    const steps = Math.floor(Math.abs(dy) / this.sheet.cellHeight) + 1;

    for (let i = 0; i < steps; i++) {
      if (this.stepY(actor, dy / steps)) return true;
    }

    return false;
  }

  draw(renderer: Renderer, cameraX: number, cameraY: number): void {
    const { sheet, cells, columns, rows } = this;
    const { cellWidth, cellHeight } = sheet;
    const { width, height } = this.game;

    const left = Math.max(0, Math.floor(cameraX / cellWidth));
    const right = Math.min(columns, Math.ceil((cameraX + width) / cellWidth));
    const top = Math.max(0, Math.floor(cameraY / cellHeight));
    const bottom = Math.min(rows, Math.ceil((cameraY + height) / cellHeight));

    for (let row = top; row < bottom; row++) {
      for (let column = left; column < right; column++) {
        const cell = cells[row * columns + column];
        if (cell < 0) continue;

        renderer.draw(
          sheet,
          cell,
          column * cellWidth - cameraX,
          row * cellHeight - cameraY,
        );
      }
    }
  }

  private stepX(actor: Actor, dx: number): boolean {
    const { cellWidth } = this.sheet;

    actor.x += dx;

    if (dx === 0 || !this.touches(actor, this.solid)) return false;

    const edge = actor.x + (dx > 0 ? actor.body.right : actor.body.left);
    const snap = dx > 0 ? Math.floor : Math.ceil;

    actor.x += snap(edge / cellWidth) * cellWidth - edge;
    return true;
  }

  private stepY(actor: Actor, dy: number): boolean {
    const { cellHeight } = this.sheet;

    actor.y += dy;

    if (dy === 0 || !this.touches(actor, this.solid)) return false;

    const edge = actor.y + (dy > 0 ? actor.body.bottom : actor.body.top);
    const snap = dy > 0 ? Math.floor : Math.ceil;

    actor.y += snap(edge / cellHeight) * cellHeight - edge;
    return true;
  }
}
