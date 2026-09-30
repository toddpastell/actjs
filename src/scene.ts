import type { Entity } from "./entity";
import type { Game } from "./game";
import { Timers } from "./timers";

export abstract class Scene {
  game!: Game;

  readonly entities: Entity[] = [];
  readonly camera = { x: 0, y: 0 };
  readonly timers = new Timers();

  private readonly found = new Map<Function, readonly Entity[]>();
  private readonly pruned: Entity[] = [];

  abstract init(): void;

  deinit(): void {}

  update(_deltaMS: number): void {}

  add<T extends Entity>(entity: T): T {
    if (entity.scene === this && this.entities.includes(entity)) {
      entity.removed = false;
      this.found.clear();
      return entity;
    }

    entity.scene = this;
    entity.removed = false;
    this.entities.push(entity);
    this.found.clear();

    entity.init();
    return entity;
  }

  remove(entity: Entity): void {
    entity.removed = true;
    this.found.clear();
  }

  all<T extends Entity>(
    type: abstract new (...args: any[]) => T,
  ): readonly T[] {
    let entities = this.found.get(type);

    if (!entities) {
      entities = this.entities.filter(
        (entity) => !entity.removed && entity instanceof type,
      );
      this.found.set(type, entities);
    }

    return entities as readonly T[];
  }

  prune(): void {
    const { entities, pruned } = this;
    let kept = 0;

    for (const entity of entities) {
      if (entity.removed) pruned.push(entity);
      else entities[kept++] = entity;
    }

    if (pruned.length === 0) return;

    entities.length = kept;
    this.found.clear();

    for (const entity of pruned) entity.deinit();
    pruned.length = 0;
  }

  reset(): void {
    this.entities.length = 0;
    this.found.clear();
    this.timers.clear();
    this.camera.x = 0;
    this.camera.y = 0;
  }
}
