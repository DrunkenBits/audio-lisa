const Readable = require("stream").Readable;

class WhiteNoise extends Readable {
  constructor(volume = 0.01) {
    super();
    this.volume = volume;
  }

  _read(n) {
    let buf = Buffer.alloc(n * 2);

    for (let i = 0; i < n; i++) {
      buf.writeUInt16LE(Math.round(Math.random() * 65535 * this.volume), i*2);
    }

    this.push(buf);
  }
}

module.exports = WhiteNoise;
