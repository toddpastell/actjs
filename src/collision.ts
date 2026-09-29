import type { Sprite } from "./sprite";
import type { Tilemap } from "./tilemap";

export type Side = "left" | "right" | "top" | "bottom";

export function collide(
  solid: Sprite,
  mover: Sprite,
  level?: Tilemap,
): Side | null {
  if (solid === mover) return null;

  const s = solid.body;
  const m = mover.body;

  const left = solid.x + s.right - (mover.x + m.left);
  const right = mover.x + m.right - (solid.x + s.left);
  const top = solid.y + s.bottom - (mover.y + m.top);
  const bottom = mover.y + m.bottom - (solid.y + s.top);

  if (left <= 0 || right <= 0 || top <= 0 || bottom <= 0) return null;

  const min = Math.min(left, right, top, bottom);

  if (min === left) {
    push(mover, left, 0, level);
    return "left";
  }

  if (min === right) {
    push(mover, -right, 0, level);
    return "right";
  }

  if (min === top) {
    push(mover, 0, top, level);
    return "top";
  }

  push(mover, 0, -bottom, level);
  return "bottom";
}

function push(sprite: Sprite, dx: number, dy: number, level?: Tilemap): void {
  if (level) {
    level.moveX(sprite, dx);
    level.moveY(sprite, dy);
  } else {
    sprite.x += dx;
    sprite.y += dy;
  }
}
