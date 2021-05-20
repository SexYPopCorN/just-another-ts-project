import { Entity } from './Entity';

export interface ComponentConstructor<Type extends Component> {
  readonly type: number;
  readonly name: string;
  readonly prototype: Type;

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

  private static types: { [key: string]: number } = {};

  public static getType(): number {
    const index = Component.types[this.name];
    return index === void 0
      ? (Component.types[this.name] = Object.keys(Component.types).length)
      : index;
  }
}
