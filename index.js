#!/usr/bin/env node

const fs = require("fs");
const wav = require("wav");
const Speaker = require("speaker");
const args = require("yargs")
  .option("target", {
    alias: "t",
    description: "The file to regenerate",
    required: true,
  })
  .argv
;

const data = [];
const data2 = [];
let format = null;

const wavStream = fs.createReadStream(args.target);
const reader = wav.Reader();

reader.on("readable", (f) => {
  //reader.pipe(new Speaker(format));
  format = f;
});

wavStream.pipe(reader);

reader.on("data", (bytes) => {
  for (let i = 0; i < bytes.byteLength; i+=2) {
    data.push(bytes.readUInt16LE(i));
  }
}); 

reader.on("end", () => {
  console.log(data.length);
  
  const sinLen = format.sampleRate * 2;
  const sinFreq = 440 / (2 * Math.PI);
  
  for (var i = 0; i < sinLen; i++) {
    data2.push((65536 * 0.5) * Math.sin()
  }
});

