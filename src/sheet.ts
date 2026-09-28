import { image } from "./assets";

export class Sheet {
  static from(url: string, cellWidth: number, cellHeight = cellWidth): Sheet {
    return new Sheet(image(url), cellWidth, cellHeight);
  }

  readonly image: HTMLImageElement;
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly columns: number;
  readonly rows: number;

  constructor(
    image: HTMLImageElement,
    cellWidth: number,
    cellHeight = cellWidth,
  ) {
    this.image = image;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;

    this.columns = Math.floor(image.width / cellWidth);
    this.rows = Math.floor(image.height / cellHeight);
  }
}
