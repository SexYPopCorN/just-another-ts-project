import { BitSet } from './BitSet';
import { ComponentType, Component } from './Component';

export class Entity {
  private components: { [key: number]: Component };
  private componentTypes: BitSet;

  public constructor() {
    this.components = {};
    this.componentTypes = new BitSet();
  }

  public addComponent<Type extends ComponentType>(type: Type, ...args: ConstructorParameters<Type>): void {
    const component = new type(...args);
  }

  public removeComponent<Type extends ComponentType>(type: Type): void {}
}
class Foo extends Component {
  constructor(x: number, y: string) {}
  public x = 100;
}
class Bar extends Component {
  public y = 100;
  constructor(x: string, y: number) {}
}

const entity = new Entity();
entity.addComponent<typeof Bar>(Bar, 1, 'sdas');
