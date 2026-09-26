import {
  Assets,
  BitmapFont,
  Cache,
  type BitmapFontData,
  type Texture,
} from "pixi.js";
import monogramUrl from "./monogram.png";

export const MONOGRAM = "monogram";
export const MONOGRAM_SIZE = 12;

const CELL_WIDTH = 6;
const CELL_HEIGHT = 12;
const COLUMNS = 16;
const ROWS = 8;
const FIRST_CHAR = 32;

export async function loadMonogram(): Promise<void> {
  const texture = await Assets.load<Texture>(monogramUrl);
  const chars: BitmapFontData["chars"] = {};

  for (let i = 0; i < COLUMNS * ROWS; i++) {
    const letter = String.fromCharCode(FIRST_CHAR + i);

    chars[letter] = {
      id: FIRST_CHAR + i,
      letter,
      page: 0,
      x: (i % COLUMNS) * CELL_WIDTH,
      y: Math.floor(i / COLUMNS) * CELL_HEIGHT,
      width: CELL_WIDTH,
      height: CELL_HEIGHT,
      xOffset: 0,
      yOffset: 0,
      xAdvance: CELL_WIDTH,
      kerning: {},
    };
  }

  const font = new BitmapFont({
    data: {
      fontFamily: MONOGRAM,
      fontSize: MONOGRAM_SIZE,
      lineHeight: CELL_HEIGHT,
      baseLineOffset: 0,
      chars,
      pages: [{ id: 0, file: monogramUrl }],
    },
    textures: [texture],
  });

  Cache.set(`${MONOGRAM}-bitmap`, font);
}
