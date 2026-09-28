import type { Entity } from "./entity";
import type { Game } from "./game";
import { Timers } from "./timers";

export abstract class Scene {
  game!: Game;

  readonly entities: Entity[] = [];
  readonly camera = { x: 0, y: 0 };
  readonly timers = new Timers();

  private readonly found = new Map<Function, readonly Entity[]>();

  abstract init(): void;

  deinit(): void {}

  update(_deltaMS: number): void {}

  add<T extends Entity>(entity: T): T {
    entity.scene = this;
    this.entities.push(entity);
    this.found.clear();

    entity.init();
    return entity;
  }

  remove(entity: Entity): void {
    entity.removed = true;
  }

  all<T extends Entity>(
    type: abstract new (...args: any[]) => T,
  ): readonly T[] {
    let entities = this.found.get(type);

    if (!entities) {
      entities = this.entities.filter((entity) => entity instanceof type);
      this.found.set(type, entities);
    }

    return entities as readonly T[];
  }

  prune(): void {
    let kept = 0;

    for (const entity of this.entities) {
      if (entity.removed) entity.deinit();
      else this.entities[kept++] = entity;
    }

    if (kept === this.entities.length) return;

    this.entities.length = kept;
    this.found.clear();
  }
}
