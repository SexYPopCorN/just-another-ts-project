import { Handle } from './Handle';

export class HandleSet<Type extends Handle> {
  private keys: { [key: string]: number | undefined };
  private values: Type[];

  public constructor() {
    this.keys = {};
    this.values = [];
  }

  public add(value: Type): HandleSet<Type> {
    if (this.keys[value.id] === void 0) {
      this.keys[value.id] = this.values.push(value) - 1;
    }
    return this;
  }

  public clear(): void {
    this.keys = {};
    this.values.length = 0;
  }

  public remove(value: Type): boolean {
    const key = this.keys[value.id];
    if (key === void 0) {
      return false;
    }
    this.keys[value.id] = void 0;
    value = <Type>this.values.pop();
    if (key < this.values.length) {
      this.values[key] = value;
      this.keys[value.id] = key;
    }
    return true;
  }

  public has(value: Type): boolean {
    return this.keys[value.id] !== void 0;
  }

  public getValues(): readonly Type[] {
    return this.values;
  }
}
