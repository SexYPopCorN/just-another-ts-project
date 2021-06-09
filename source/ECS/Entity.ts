import { BitSet } from '../Container/BitSet';
import { Archetype } from './Archetype';
import { Component } from './Component';

export class Entity {
  public readonly id: number;
  public readonly components: { [key: number]: Component };
  public readonly types: BitSet;
  public archetype: Archetype | null;

  private static counter: number = 0;

  constructor() {
    this.id = ++Entity.counter;
    this.components = {};
    this.types = new BitSet();
    this.archetype = null;
  }
}
