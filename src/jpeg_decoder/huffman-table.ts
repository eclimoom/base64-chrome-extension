import { DataStream } from './data-stream';
import { createArray } from './utils';

export class HuffmanTable {
  static MSB = 0x80000000;

  l: number[][][];
  th: number[];
  v: number[][][][];
  tc: number[][];

  constructor() {
    this.l = createArray(4, 2, 16) as number[][][];
    this.th = [0, 0, 0, 0];
    this.v = createArray(4, 2, 16, 200) as number[][][][];
    this.tc = [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ];
  }

  // tslint:disable-next-line:typedef
  read(data: DataStream, HuffTab: number[][][]) {
    let count = 0;
    let temp;
    let t;
    let c;
    let i;
    let j;

    const length = data.get16();
    count += 2;

    while (count < length) {
      temp = data.get8();
      count += 1;
      // tslint:disable-next-line:no-bitwise
      t = temp & 0x0f;
      if (t > 3) {
        throw new Error('ERROR: Huffman table ID > 3');
      }

      // tslint:disable-next-line:no-bitwise
      c = temp >> 4;
      if (c > 2) {
        throw new Error('ERROR: Huffman table [Table class > 2 ]');
      }

      this.th[t] = 1;
      this.tc[t][c] = 1;

      for (i = 0; i < 16; i += 1) {
        this.l[t][c][i] = data.get8();
        count += 1;
      }

      for (i = 0; i < 16; i += 1) {
        for (j = 0; j < this.l[t][c][i]; j += 1) {
          if (count > length) {
            throw new Error('ERROR: Huffman table format error [count>Lh]');
          }

          this.v[t][c][i][j] = data.get8();
          count += 1;
        }
      }
    }

    if (count !== length) {
      throw new Error('ERROR: Huffman table format error [count!=Lf]');
    }

    for (i = 0; i < 4; i += 1) {
      for (j = 0; j < 2; j += 1) {
        if (this.tc[i][j] !== 0) {
          this.buildHuffTable(HuffTab[i][j], this.l[i][j], this.v[i][j]);
        }
      }
    }

    return 1;
  }

  // tslint:disable-next-line:typedef
  buildHuffTable(tab: number[], L: number[], V: number[][]) {
    // tslint:disable-next-line:one-variable-per-declaration
    let currentTable, k, i, j, n;
    const temp = 256;
    k = 0;

    for (i = 0; i < 8; i += 1) {
      // i+1 is Code length
      for (j = 0; j < L[i]; j += 1) {
        // tslint:disable-next-line:no-bitwise
        for (n = 0; n < temp >> (i + 1); n += 1) {
          // tslint:disable-next-line:no-bitwise
          tab[k] = V[i][j] | ((i + 1) << 8);
          k += 1;
        }
      }
    }

    for (i = 1; k < 256; i += 1, k += 1) {
      // tslint:disable-next-line:no-bitwise
      tab[k] = i | HuffmanTable.MSB;
    }

    currentTable = 1;
    k = 0;

    for (i = 8; i < 16; i += 1) {
      // i+1 is Code length
      for (j = 0; j < L[i]; j += 1) {
        // tslint:disable-next-line:no-bitwise
        for (n = 0; n < temp >> (i - 7); n += 1) {
          // tslint:disable-next-line:no-bitwise
          tab[currentTable * 256 + k] = V[i][j] | ((i + 1) << 8);
          k += 1;
        }

        if (k >= 256) {
          if (k > 256) {
            throw new Error('ERROR: Huffman table error(1)!');
          }

          k = 0;
          currentTable += 1;
        }
      }
    }
  }
}
