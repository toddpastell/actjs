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
  select: ["Shift"],
};

const BY_CODE = new Map<string, Control>(
  (Object.keys(KEYS) as Control[]).flatMap((control) =>
    KEYS[control].map((code) => [code, control] as const),
  ),
);

export class Input {
  private readonly down = new Set<Control>();
  private current: ReadonlySet<Control> = new Set();
  private previous: ReadonlySet<Control> = new Set();

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
    return this.current.has(control);
  }

  pressed(control: Control): boolean {
    return this.current.has(control) && !this.previous.has(control);
  }

  released(control: Control): boolean {
    return !this.current.has(control) && this.previous.has(control);
  }

  get x(): number {
    return (this.held("right") ? 1 : 0) - (this.held("left") ? 1 : 0);
  }

  get y(): number {
    return (this.held("down") ? 1 : 0) - (this.held("up") ? 1 : 0);
  }

  poll(): void {
    this.previous = this.current;
    this.current = new Set(this.down);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const control = BY_CODE.get(event.code);
    if (!control) return;

    event.preventDefault();

    this.down.add(control);
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    const control = BY_CODE.get(event.code);
    if (!control) return;

    event.preventDefault();

    this.down.delete(control);
  };

  private onBlur = (): void => {
    this.down.clear();
    this.current = new Set();
    this.previous = new Set();
  };

  private onVisibilityChange = (): void => {
    if (!document.hidden) return;
    this.onBlur();
  };
}
