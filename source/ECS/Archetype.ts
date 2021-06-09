import { BitSet } from '../Container/BitSet';
import { Component, ComponentConstructor } from './Component';
import { Entity } from './Entity';

export class Archetype {
  public readonly types: BitSet;
  public readonly components: { [key: number]: Component[] };
  public readonly indices: { [key: number]: number };
  public size: number;

  public constructor(...components: ComponentConstructor<Component>[]) {
    this.types = new BitSet();
    this.components = {};
    this.indices = {};
    this.size = 0;
    for (let i = 0; i < components.length; i++) {
      const type = components[i].getType();
      this.types.set(type);
      this.components[type] = [];
    }
  }

  public addEntity(entity: Entity): void {
    const index = this.indices[entity.id];
    if (index !== void 0) {
      console.warn(`Entity with id ${entity.id} is already in archetype.`);
      return;
    }
    for (let key in this.components) {
      this.components[key][this.size] = entity.components[key];
    }
    this.indices[entity.id] = this.size++;
    entity.archetype = this;
  }

  public removeEntity(entity: Entity): void {
    const index = this.indices[entity.id];
    if (index === void 0) {
      console.warn(`Entity with id ${entity.id} is not in archetype.`);
      return;
    }
    entity.archetype = null;
    const components: any = {};
    for (let type in this.components) {
      components[type] = this.components[type].pop();
    }
    this.size--;
    if (index < this.size) {
      for (let key in this.indices) {
        if (this.indices[key] === this.size) {
          this.indices[key] = index;
          for (let type in this.components) {
            this.components[type][index] = components[type];
          }
          break;
        }
      }
    }
  }
}
