import { BitSet } from '../BitSet';
import { Component, ComponentConstructor } from './Component';
import { Entity } from './Entity';

export abstract class System {
  public readonly priority: number = 0;

  private componentTypes: BitSet;
  private queryKey: string;

  constructor(...components: ComponentConstructor<Component>[]) {
    this.componentTypes = new BitSet();
    for (let i = 0; i < components.length; i++) {
      this.componentTypes.set(components[i].type);
    }
    this.queryKey = this.componentTypes.toString();
  }

  public getComponentTypes(): BitSet {
    return this.componentTypes;
  }

  public getQueryKey(): string {
    return this.queryKey;
  }

  public abstract update(delta: number, entities: Entity[]): void;
  public abstract initialize?(): void;
  public abstract sort?(previous: Entity, next: Entity): number;
}
