import { Entity } from './Entity';

export interface ComponentConstructor<Type extends Component> extends Function {
  new (...args: any[]): Type;
}

export abstract class Component {
  private entity: Entity | null;

  public constructor() {
    this.entity = null;
  }

  public getEntity(): Entity | null {
    return this.entity;
  }

  public setEntity(entity: Entity): Component {
    this.entity = entity;
    return this;
  }

  public unsetEntity(): Component {
    this.entity = null;
    return this;
  }

  public onAdd(entity: Entity): void {}

  public onRemove(entity: Entity): void {}

  private static typeIdMap = new Map<ComponentConstructor<Component>, number>();
  private static typeIdCounter = 0;

  public static getTypeId(
    constructor: ComponentConstructor<Component>
  ): number {
    const typeId = Component.typeIdMap.get(constructor);
    if (typeId !== void 0) {
      return typeId;
    }
    Component.typeIdMap.set(constructor, Component.typeIdCounter);
    return Component.typeIdCounter++;
  }
}
