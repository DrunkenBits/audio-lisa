#!/usr/bin/env node

const fs = require("fs");
const wav = require("wav");
const Speaker = require("speaker");
const Readable = require("stream").Readable;
const WhiteNoise = require("./white-noise");
const ReadableBuffer = require("./readable-buffer");
const Sine = require("./sine");
const args = require("yargs")
  .option("target", {
    alias: "t",
    description: "The file to regenerate",
    required: true,
  })
  .argv
;

const data = [];
let format = null;
let speaker = null;

const wavStream = fs.createReadStream(args.target);
const reader = wav.Reader();

reader.on("format", (format) => {
  console.log(format);
  speaker = new Speaker(format);
})

wavStream.pipe(reader);

reader.on("data", (bytes) => {
  for (let i = 0; i < bytes.byteLength; i += 2) {
    data.push(bytes.readUInt16LE(i));
  }
});

reader.on("end", () => {
  const sines = [];
  let values = null;
  let maxLength = 0;

  for (let k = 0; k < 10; k++) {
    let length = 10.0 * Math.random();
    let offset = 5.0 * Math.random();

    if (maxLength < length + offset) {
      maxLength = length + offset;
    }

    sines.push(new Sine(
      Math.random() * 2000,
      0.5 * Math.random(),
      length,
      offset
    ));
  }

  const samples = maxLength * 44100;
  console.log(maxLength, samples);
  const data2 = Buffer.alloc(samples);
  values = sines.map((s) => s.read(data2.length));

  for (let k = 0; k < data2.length - 2; k += 2) {
    const sum = values.reduce((sum, v) => sum + v.readInt16LE(k), 0);
    data2.writeInt16LE(sum / 10, k);
  }

  console.log("Playing");
  const rb = new ReadableBuffer(data2);
  rb.pipe(speaker);
});
