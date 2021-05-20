import { Component } from './EntityComponentSystem/Component';
import { Entity } from './EntityComponentSystem/Entity';

class A extends Component {
  public x: number = 0;
  public y: number = 0;
}

class B extends Component {
  public a: string = 'foo';
  public b: string = 'bar';

  public onAdd(entity: Entity): void {
    console.log(`added to entity ${entity.id}`);
  }
  public onRemove(entity: Entity): void {
    console.log(`removed from entity ${entity.id}`);
  }
}

class Foo extends Entity {
  public constructor(id: number) {
    super(id);

    this.addComponent(A);
    this.addComponent(B);
  }
}

const foo = new Foo(10);

console.log(foo.getComponent(A), foo.getComponent(B));
