import { Entity } from './Entity';
import { UniqueSet } from '../Container/UniqueSet';
import { World } from './World';

export class EntityManager {
  private world: World;
  private entities: UniqueSet<Entity>;

  public constructor(wolrd: World) {
    this.world = wolrd;
    this.entities = new UniqueSet();
  }

  public getEntities(): readonly Entity[] {
    return this.entities.getValues();
  }
}
