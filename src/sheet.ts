import { Assets, Rectangle, Texture } from "pixi.js";

export class Sheet {
  private static readonly cache = new Map<string, Sheet>();

  static get(url: string, cellWidth: number, cellHeight = cellWidth): Sheet {
    const key = `${url}:${cellWidth}x${cellHeight}`;
    let sheet = Sheet.cache.get(key);

    if (!sheet) {
      const texture = Assets.get<Texture>(url);
      if (!texture) throw new Error("Asset not loaded");

      sheet = new Sheet(texture, cellWidth, cellHeight);
      Sheet.cache.set(key, sheet);
    }

    return sheet;
  }

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
