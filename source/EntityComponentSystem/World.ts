import { EntityManager } from './EntityManager';
import { QueryManager } from './QueryManager';

export class World {
  public readonly entityManager: EntityManager;
  public readonly queryManager: QueryManager;

  public constructor() {
    this.entityManager = new EntityManager(this);
    this.queryManager = new QueryManager(this);
  }
}
