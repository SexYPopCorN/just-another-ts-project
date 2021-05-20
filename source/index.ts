import { Component } from './EntityComponentSystem/Component';
import { Entity } from './EntityComponentSystem/Entity';

class A extends Component {
  public x: number = 0;
  public y: number = 0;

  public static type = A.getType();
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

  public static type = B.getType();
  // public static getTypeId2(): number {
  //   console.log(100);
  //   return 100;
  // }
}

class Foo extends Entity {
  public constructor(id: number) {
    super(id);

    this.addComponent(A);
    this.addComponent(B);
  }
}

const foo = new Foo(10);
console.log(B.id);
console.log(A.id);
console.log(foo.getComponent(A), foo.getComponent(B));
