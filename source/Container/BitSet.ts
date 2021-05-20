export class BitSet {
  private static readonly WORD_LENGTH_LOG = 5;

  private words: number[];

  public constructor() {
    this.words = [];
  }

  public clone(): BitSet {
    const instance = new BitSet();
    for (let i = 0; i < this.words.length; i++) {
      instance.words[i] = this.words[i];
    }
    return instance;
  }

  public set(position: number): BitSet {
    position |= 0;
    const index = position >>> BitSet.WORD_LENGTH_LOG;
    this.scale(index + 1);
    this.words[index] |= 1 << position;
    return this;
  }

  public unset(position: number): BitSet {
    position |= 0;
    const index = position >>> BitSet.WORD_LENGTH_LOG;
    if (index < this.words.length) {
      this.words[index] &= ~(1 << position);
      this.filter();
    }
    return this;
  }

  public flip(position: number): BitSet {
    position |= 0;
    const index = position >>> BitSet.WORD_LENGTH_LOG;
    this.scale(index + 1);
    this.words[index] ^= 1 << position;
    this.filter();
    return this;
  }

  public isset(position: number): boolean {
    position |= 0;
    const index = position >>> BitSet.WORD_LENGTH_LOG;
    return index < this.words.length && !!((this.words[index] >>> position) & 1);
  }

  public contains(set: BitSet): boolean {
    if (this.words.length < set.words.length) {
      return false;
    }
    for (let i = 0; i < set.words.length; i++) {
      if ((this.words[i] & set.words[i]) !== set.words[i]) {
        return false;
      }
    }
    return true;
  }

  public toString(radix: number = 36): string {
    let result = '';
    for (let i = this.words.length - 1; i >= 0; i--) {
      result += this.words[i].toString(radix);
    }
    return result;
  }

  private scale(size: number): void {
    for (let i = this.words.length; i < size; i++) {
      this.words[i] = 0;
    }
  }

  private filter(): void {
    while (this.words.length) {
      if (this.words[this.words.length - 1] !== 0) {
        return;
      }
      this.words.pop();
    }
  }
}
