import { BitSet } from '../BitSet';
import { Component, ComponentConstructor } from './Component';
import { Handle } from '../Handle';

export class Entity extends Handle {
  private components: { [key: number]: Component | undefined };
  private componentTypeIds: BitSet;

  public constructor(id: number) {
    super(id);

    this.components = {};
    this.componentTypeIds = new BitSet();
  }

  public addComponent<Type extends Component, Args extends any[] = []>(
    constructor: ComponentConstructor<Type>,
    ...args: Args
  ): Entity {
    const id = Component.getTypeId(constructor);
    if (this.componentTypeIds.isset(id)) {
      throw new Error(
        `Entity::addComponent() Error: Entity already has [${constructor.name}] component.`
      );
    }
    const component = new constructor(...args);
    this.components[id] = component;
    this.componentTypeIds.set(id);
    component.setEntity(this).onAdd(this);
    return this;
  }

  public getComponent<Type extends Component>(
    constructor: ComponentConstructor<Type>
  ): Type {
    const id = Component.getTypeId(constructor);
    if (!this.componentTypeIds.isset(id)) {
      throw new Error(
        `Entity::getComponent() Error: Entity does not have [${constructor.name}] component.`
      );
    }
    return <Type>this.components[id];
  }

  public removeComponent<Type extends Component>(
    constructor: ComponentConstructor<Type>
  ): Entity {
    const id = Component.getTypeId(constructor);
    if (!this.componentTypeIds.isset(id)) {
      throw new Error(
        `Entity::removeComponent() Error: Entity does not have [${constructor.name}] component.`
      );
    }
    const component = <Type>this.components[id];
    this.components[id] = void 0;
    this.componentTypeIds.unset(id);
    component.unsetEntity().onRemove(this);
    return this;
  }

  public hasComponent<Type extends Component>(
    constructor: ComponentConstructor<Type>
  ): boolean {
    return this.componentTypeIds.isset(Component.getTypeId(constructor));
  }
}
