const Readable = require("stream").Readable;

class ReadableBuffer extends Readable {
  constructor(buffer) {
    super();
    this.buffer = buffer;
    this.offset = 0;
  }

  _read(n) {
    if (this.offset >= this.buffer.length) {
      this.push(null);
      return;
    }
    
    const slice = this.buffer.slice(this.offset, this.offset + n);
    this.push(slice);
    this.offset += n;
  }
}

module.exports = ReadableBuffer;
