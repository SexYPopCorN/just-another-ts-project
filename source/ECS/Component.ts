import { Entity } from './Entity';

export interface ComponentConstructor<Type extends Component> {
  readonly name: string;
  readonly prototype: Type;

  new (...args: any[]): Type;
  getType(): number;
}

export abstract class Component {
  private entity: Entity | null;

  public constructor() {
    this.entity = null;
  }

  public getEntity(): Entity | null {
    return this.entity;
  }

  public setEntity(entity: Entity | null): void {
    this.entity = entity;
  }

  private static types: { [key: string]: number } = {};

  public static getType(): number {
    const key = this.name;
    const type = this.types[key];
    return type === void 0 ? (this.types[key] = Object.keys(this.types).length) : type;
  }
}
