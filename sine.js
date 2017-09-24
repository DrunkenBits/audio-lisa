const Readable = require("stream").Readable;

class Sine extends Readable {
  constructor(freq = 440, volume = 0.01, duration = false, offset = 0, samplesRate = 44100) {
    super();

    this.samplesRate = samplesRate;
    this.freq = freq;
    this.duration = duration;
    this.offset = offset;
    this.volume = volume;
    this.samplesCount = 0;
  }

  _read(n) {
    let buf = Buffer.alloc(n * 2);

    let offset = 0;
    for (let i = 0; i < n; i++) {
      const isStarted = (this.samplesCount > Math.round((this.offset || 0) * this.samplesRate));
      const isEnded = (
        this.duration &&
        this.samplesCount > Math.round(((this.offset || 0) + this.duration) * this.samplesRate)
      );

      const isPlaying = isStarted && !isEnded;

      this.samplesCount++;

      if (!isPlaying) {
        continue;
      }

      offset = (this.samplesCount + i) / (this.samplesRate / this.freq);
      buf.writeInt16LE(Math.sin(offset * Math.PI * 2) * 32767 * this.volume, i * 2);
    }

    this.push(buf);
  }
}

module.exports = Sine;
