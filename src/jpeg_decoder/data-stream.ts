export class DataStream {
  buffer: Uint8Array;
  index: number;

  constructor(data: ArrayBuffer, offset?: number, length?: number) {
    this.buffer = new Uint8Array(data, offset, length);
    this.index = 0;
  }

  // tslint:disable-next-line:typedef
  get16() {
    // var value = this.buffer.getUint16(this.index, false);
    // tslint:disable-next-line:no-bitwise
    const value = (this.buffer[this.index] << 8) + this.buffer[this.index + 1]; // DataView is big-endian by default
    this.index += 2;
    return value;
  }

  // tslint:disable-next-line:typedef
  get8() {
    // var value = this.buffer.getUint8(this.index);
    const value = this.buffer[this.index];
    this.index += 1;
    return value;
  }
}
