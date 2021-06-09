import { Entity } from './Entity';

export interface ComponentType<Type extends Component = Component> {
  new (...args: any): Type;
  getId(): number;
}

export abstract class Component {
  private owner: null | Entity;

  public constructor() {
    this.owner = null;
  }

  public getOwner(): null | Entity {
    return this.owner;
  }

  public setOwner(owner: Entity): void {
    this.owner = owner;
  }

  public unsetOwner(): void {
    this.owner = null;
  }

  public static getId = (() => {
    let id = 0;
    return function (this: any) {
      if (this.id === void 0) {
        Object.defineProperty(this, 'id', {
          value: id++,
          configurable: false,
          enumerable: false,
          writable: false
        });
      }
      return this.id;
    };
  })();
}
