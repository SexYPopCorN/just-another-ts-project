import { BitSet } from '../Container/BitSet';
import { Component, ComponentConstructor } from './Component';
import { Handle } from '../Handle';

export class Entity extends Handle {
  private components: { [key: number]: Component | undefined };
  private componentTypes: BitSet;

  public constructor(id: number) {
    super(id);

    this.components = {};
    this.componentTypes = new BitSet();
  }

  public addComponent<Type extends Component, Args extends any[] = []>(
    constructor: ComponentConstructor<Type>,
    ...args: Args
  ): Entity {
    const type = constructor.type;
    if (this.componentTypes.isset(type)) {
      throw new Error(`Entity::addComponent() Error: Entity already has [${constructor.name}] component.`);
    }
    const component = new constructor(...args);
    this.components[type] = component;
    this.componentTypes.set(type);
    component.setEntity(this);
    if (component.onAdd !== void 0) {
      component.onAdd(this);
    }
    return this;
  }

  public getComponent<Type extends Component>(constructor: ComponentConstructor<Type>): Type {
    const type = constructor.type;
    if (!this.componentTypes.isset(type)) {
      throw new Error(`Entity::getComponent() Error: Entity does not have [${constructor.name}] component.`);
    }
    return <Type>this.components[type];
  }

  public removeComponent<Type extends Component>(constructor: ComponentConstructor<Type>): Entity {
    const type = constructor.type;
    if (!this.componentTypes.isset(type)) {
      throw new Error(`Entity::removeComponent() Error: Entity does not have [${constructor.name}] component.`);
    }
    const component = <Type>this.components[type];
    this.components[type] = void 0;
    this.componentTypes.unset(type);
    component.unsetEntity();
    if (component.onRemove !== void 0) {
      component.onRemove(this);
    }
    return this;
  }

  public hasComponent<Type extends Component>(constructor: ComponentConstructor<Type>): boolean {
    return this.componentTypes.isset(constructor.type);
  }

  public hasComponentTypes(types: BitSet): boolean {
    return this.componentTypes.contains(types);
  }
}
