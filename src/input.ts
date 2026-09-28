export type Control =
  "left" | "right" | "up" | "down" | "a" | "b" | "start" | "select";

const KEYS: Record<Control, string[]> = {
  left: ["ArrowLeft", "KeyA"],
  right: ["ArrowRight", "KeyD"],
  up: ["ArrowUp", "KeyW"],
  down: ["ArrowDown", "KeyS"],
  a: ["KeyZ", "Space"],
  b: ["KeyX"],
  start: ["Enter"],
  select: ["ShiftLeft", "ShiftRight"],
};

const CONTROLS = Object.keys(KEYS) as Control[];

const BITS = Object.fromEntries(
  CONTROLS.map((control, i) => [control, 1 << i]),
) as Record<Control, number>;

const BY_CODE = new Map<string, number>(
  CONTROLS.flatMap((control) =>
    KEYS[control].map((code) => [code, BITS[control]] as const),
  ),
);

export class Input {
  private down = 0;
  private current = 0;
  private previous = 0;

  init(): void {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onBlur);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  deinit(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.onBlur);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);

    this.onBlur();
  }

  held(control: Control): boolean {
    return (this.current & BITS[control]) !== 0;
  }

  pressed(control: Control): boolean {
    return (this.current & ~this.previous & BITS[control]) !== 0;
  }

  released(control: Control): boolean {
    return (~this.current & this.previous & BITS[control]) !== 0;
  }

  get x(): number {
    return (this.held("right") ? 1 : 0) - (this.held("left") ? 1 : 0);
  }

  get y(): number {
    return (this.held("down") ? 1 : 0) - (this.held("up") ? 1 : 0);
  }

  poll(): void {
    this.previous = this.current;
    this.current = this.down;
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const bit = BY_CODE.get(event.code);
    if (!bit) return;

    event.preventDefault();

    this.down |= bit;
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    const bit = BY_CODE.get(event.code);
    if (!bit) return;

    event.preventDefault();

    this.down &= ~bit;
  };

  private onBlur = (): void => {
    this.down = 0;
    this.current = 0;
    this.previous = 0;
  };

  private onVisibilityChange = (): void => {
    if (!document.hidden) return;
    this.onBlur();
  };
}
