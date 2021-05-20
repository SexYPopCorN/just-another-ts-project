import { Unique } from './Interface/Unique';

export abstract class Handle implements Unique {
  public readonly id: number;

  constructor(id: number) {
    this.id = id;
  }
}
