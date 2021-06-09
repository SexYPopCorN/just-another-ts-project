export class BitSet {
  public static readonly WORD_LENGTH = 32;
  public static readonly WORD_LENGTH_LOG = 5;

  private length: number;
  private words: number[];

  public constructor(length: number = BitSet.WORD_LENGTH) {
    this.length = Math.max(length | 0, BitSet.WORD_LENGTH);
    this.words = [];
    const size = (this.length - 1) >>> BitSet.WORD_LENGTH_LOG;
    for (let i = 0; i <= size; i++) {
      this.words[i] = 0;
    }
  }

  public clone(): BitSet {
    const clone = new BitSet(this.length);
    for (let i = 0; i < this.words.length; i++) {
      clone.words[i] = this.words[i];
    }
    return clone;
  }

  public set(position: number): void {
    position |= 0;
    if (position >= this.length) {
      throw new Error(
        `BitSet::set() Error: Position [${position}] is out of bounds.`
      );
    }
    this.words[position >>> BitSet.WORD_LENGTH_LOG] |= 1 << position;
  }

  public unset(position: number): void {
    position |= 0;
    if (position >= this.length) {
      throw new Error(
        `BitSet::unset() Error: Position [${position}] is out of bounds.`
      );
    }
    this.words[position >>> BitSet.WORD_LENGTH_LOG] &= ~(1 << position);
  }

  public flip(position: number): void {
    position |= 0;
    if (position >= this.length) {
      throw new Error(
        `BitSet::unset() Error: Position [${position}] is out of bounds.`
      );
    }
    this.words[position >>> BitSet.WORD_LENGTH_LOG] ^= 1 << position;
  }

  public isset(position: number): boolean {
    position |= 0;
    return (
      position < this.length &&
      !!((this.words[position >>> BitSet.WORD_LENGTH_LOG] >>> position) & 1)
    );
  }

  public contains(set: BitSet): boolean {
    if (this.length < set.length) {
      return false;
    }
    for (let i = 0; i < set.words.length; i++) {
      if ((this.words[i] & set.words[i]) !== set.words[i]) {
        return false;
      }
    }
    return true;
  }

  public intersects(set: BitSet): boolean {
    const length =
      this.length < set.length ? this.words.length : set.words.length;
    for (let i = 0; i < length; i++) {
      if (!!(this.words[i] & set.words[i])) {
        return true;
      }
    }
    return false;
  }

  public forEach(callback: (position: number) => void): void {
    for (let i = 0; i < this.words.length; i++) {
      let word = this.words[i];
      while (word) {
        const position = BitSet.getLSBPosition(word);
        callback(position + BitSet.WORD_LENGTH * i);
        word &= ~(1 << position);
      }
    }
  }

  private static readonly DEBRUIJN_CONSTANT = 0b00000111110001001010110011011101;
  private static readonly DEBRUIJN_BIT_POSITION = (() => {
    const result = [];
    for (let i = 0; i < BitSet.WORD_LENGTH; i++) {
      result[(BitSet.DEBRUIJN_CONSTANT << i) >>> 27] = i;
    }
    return result;
  })();

  private static getLSBPosition(word: number): number {
    return BitSet.DEBRUIJN_BIT_POSITION[
      ((word & -word) * BitSet.DEBRUIJN_CONSTANT) >>> 27
    ];
  }
}
