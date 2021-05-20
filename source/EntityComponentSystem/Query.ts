import { BitSet } from '../Container/BitSet';
import { Entity } from './Entity';
import { UniqueSet } from '../Container/UniqueSet';

export class Query {
  private componentTypes: BitSet;
  private entities: UniqueSet<Entity>;
  private key: string;

  public constructor(componentTypes: BitSet) {
    this.componentTypes = componentTypes;
    this.entities = new UniqueSet();
    this.key = this.componentTypes.toString();
  }

  public getKey(): string {
    return this.key;
  }

  public addEntity(entity: Entity): void {
    if (this.matches(entity)) {
      this.entities.add(entity);
    }
  }

  public removeEntity(entity: Entity): void {
    this.entities.remove(entity);
  }

  public matches(entity: Entity): boolean {
    return entity.hasComponentTypes(this.componentTypes);
  }
}
