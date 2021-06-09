import { BitSet } from '../Container/BitSet';
import { Archetype } from './Archetype';
import { Component, ComponentConstructor } from './Component';
import { Entity } from './Entity';

export class Manager {
  public readonly archetypes: Archetype[];

  public constructor() {
    this.archetypes = [];
  }

  public createEntity(): Entity {
    return new Entity();
  }

  public addComponents(entity: Entity, ...constructors: ComponentConstructor<Component>[]): void {
    if (entity.archetype) {
      entity.archetype.removeEntity(entity);
    }
    for (let i = 0; i < constructors.length; i++) {
      const type = constructors[i].getType();
      entity.types.set(type);
      entity.components[type] = new constructors[i]();
      entity.components[type].setEntity(entity);
    }
    for (let key in entity.components) {
      constructors.push(<ComponentConstructor<Component>>entity.components[key].constructor);
    }
    const archetype = this.createArchetype(...constructors);
    archetype.addEntity(entity);
    console.log(archetype);
  }

  private createArchetype(...constructors: ComponentConstructor<Component>[]): Archetype {
    const types = new BitSet();
    for (let i = 0; i < constructors.length; i++) {
      types.set(constructors[i].getType());
    }
    for (let i = 0; i < this.archetypes.length; i++) {
      const archetype = this.archetypes[i];
      if (archetype.types.equals(types)) {
        console.info(`Returning existing archetype.`);
        return archetype;
      }
    }
    console.info(`Returning new archetype.`);
    const result = new Archetype(...constructors);
    this.archetypes.push(result);
    return result;
  }

  with<Types extends Component[]>(
    callback: (...components: Types) => void,
    ...constructors: ComponentConstructor<Component>[]
  ): void {
    const types = new BitSet();
    for (let i = 0; i < constructors.length; i++) {
      types.set(constructors[i].getType());
    }
    const archetypes = [];
    for (let i = 0; i < this.archetypes.length; i++) {
      const archetype = this.archetypes[i];
      if (archetype.types.contains(types)) {
        archetypes.push(archetype);
      }
    }
    type Bar<T extends unknown[]> = [...T];

    for (let i = 0; i < archetypes.length; i++) {
      const archetype = archetypes[i];
      for (let k = 0; k < archetype.size; k++) {
        // type xxx = [...Types];
        const args: [...Types] = [{}];
        for (let j = 0; j < constructors.length; j++) {
          args.push(<any>archetype.components[constructors[j].getType()][k]);
        }
        callback(...args);
      }
    }
  }
}
