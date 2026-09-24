import { Rectangle, Texture } from "pixi.js";

export class Sheet {
  readonly texture: Texture;
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly columns: number;
  readonly rows: number;

  private readonly textures: Texture[];

  constructor(texture: Texture, cellWidth: number, cellHeight = cellWidth) {
    this.texture = texture;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;

    this.columns = Math.floor(texture.width / cellWidth);
    this.rows = Math.floor(texture.height / cellHeight);

    this.textures = [];

    for (let i = 0; i < this.columns * this.rows; i++) {
      const x = (i % this.columns) * cellWidth;
      const y = Math.floor(i / this.columns) * cellHeight;

      this.textures.push(
        new Texture({
          source: texture.source,
          frame: new Rectangle(x, y, cellWidth, cellHeight),
        }),
      );
    }
  }

  cell(index: number): Texture {
    return this.textures[index];
  }
}
