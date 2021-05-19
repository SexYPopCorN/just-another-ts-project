export abstract class Handle {
  abstract readonly id: number;
}

export class Container<Type extends Handle> {
  private items: Type[];
  private indices: { [key: string]: number | undefined };

  public constructor() {
    this.items = [];
    this.indices = {};
  }

  public add(item: Type): boolean {
    if (this.indices[item.id] !== void 0) {
      return false;
    }
    this.indices[item.id] = this.items.push(item) - 1;
    return true;
  }

  public remove(item: Type): boolean {
    const index = this.indices[item.id];
    if (index === void 0) {
      return false;
    }
    this.indices[item.id] = void 0;
    item = <Type>this.items.pop();
    if (index < this.items.length) {
      this.items[index] = item;
      this.indices[item.id] = index;
    }
    return true;
  }

  public getSize(): number {
    return this.items.length;
  }

  public getItems(): readonly Type[] {
    return this.items;
  }
}
