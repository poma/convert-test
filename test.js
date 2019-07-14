// browserify test.js -o test_bundle.js
const stringifyBigInts1 = require("websnark/tools/stringifybigint").stringifyBigInts;
const unstringifyBigInts1 = require("websnark/tools/stringifybigint").unstringifyBigInts;
const stringifyBigInts2 = require("snarkjs/src/stringifybigint").stringifyBigInts;
const unstringifyBigInts2 = require("snarkjs/src/stringifybigint").unstringifyBigInts;
const bigInt1 = require("big-integer");
const bigInt2 = require("snarkjs/src/bigint");

function convertWitness1(witness) {
  const buffLen = witness.length * 32;
  const buff = new ArrayBuffer(buffLen);
  const h = {
    dataView: new DataView(buff),
    offset: 0
  };
  for (let i=0; i<witness.length; i++) {
    for (let j=0; j<8; j++) {
      const v = witness[i].shiftRight(j*32).and(0xFFFFFFFF).toJSNumber();
      h.dataView.setUint32(h.offset, v, true);
      h.offset += 4;
    }
  }
  return buff;
}

function convertWitness2(witness) {
  const buffLen = witness.length * 32;
  const buff = new ArrayBuffer(buffLen);
  const h = {
    dataView: new DataView(buff),
    offset: 0
  };
  for (let i=0; i<witness.length; i++) {
    for (let j=0; j<8; j++) {
      const v = Number(witness[i].shr(j * 32).and(BigInt(0xFFFFFFFF)));
      h.dataView.setUint32(h.offset, v, true);
      h.offset += 4;
    }
  }
  return buff;
}

(async () => {
  const witness = require("./witness.json");
  console.log("Witness length:", witness.length);

  console.time("Unstringify 1");
  const unstr1 = unstringifyBigInts1(witness);
  console.timeEnd("Unstringify 1");

  console.time("Unstringify 2");
  const unstr2 = unstringifyBigInts2(witness);
  console.timeEnd("Unstringify 2");

  console.time("Stringify 1");
  stringifyBigInts1(unstr1);
  console.timeEnd("Stringify 1");

  console.time("Stringify 2");
  stringifyBigInts2(unstr2);
  console.timeEnd("Stringify 2");

  console.time("Convert 1");
  convertWitness1(unstr1);
  console.timeEnd("Convert 1");

  console.time("Convert 2");
  convertWitness2(unstr2);
  console.timeEnd("Convert 2");
})();
