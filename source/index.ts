import { Container, Handle } from './Container';

class Foo extends Handle {
  static id = 0;

  public readonly id: number;

  public constructor() {
    super();
    this.id = ++Foo.id;
  }
}
