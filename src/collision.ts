import type { Actor } from "./actor";

export type Side = "left" | "right" | "top" | "bottom";

export function collide(solid: Actor, mover: Actor): Side | null {
  const s = solid.body;
  const m = mover.body;

  const left = solid.x + s.right - (mover.x + m.left);
  const right = mover.x + m.right - (solid.x + s.left);
  const up = solid.y + s.bottom - (mover.y + m.top);
  const down = mover.y + m.bottom - (solid.y + s.top);

  if (left <= 0 || right <= 0 || up <= 0 || down <= 0) return null;

  const min = Math.min(left, right, up, down);

  if (min === left) {
    mover.x += left;
    return "left";
  }

  if (min === right) {
    mover.x -= right;
    return "right";
  }

  if (min === up) {
    mover.y += up;
    return "top";
  }

  mover.y -= down;
  return "bottom";
}
