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

const wavStream = fs.createReadStream(args.target);
const reader = wav.Reader();

reader.on("readable", (format) => {
  //reader.pipe(new Speaker(format));
});

wavStream.pipe(reader);

const data = [];

reader.on("data", (bytes) => {
  for (let i = 0; i < bytes.byteLength; i+=2) {
    data.push(bytes.readUInt16LE(i));
  }
}); 

reader.on("end", () => {
  console.log(data.length);
});

