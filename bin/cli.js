#!/usr/bin/env node
'use strict';

const fs = require('fs');
const json5 = require('json5');
const onml = require('onml');

const lib = require('../lib');
const def = require('../skins/default.js');
const narrow = require('../skins/narrow.js');
const lowkey = require('../skins/lowkey.js');

const skins = Object.assign({}, def, narrow, lowkey);

const argv = {
    input: undefined,
    indent: undefined
};

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-i' || arg === '--input') {
        argv.input = args[++i];
    } else if (arg === '-t' || arg === '--indent') {
        argv.indent = args[++i];
    } else if (arg === '-h' || arg === '--help') {
        console.log('Usage: wavedrom --input <path> [--indent <indent>]');
        process.exit(0);
    }
}

if (!argv.input) {
    console.error('Error: --input <path> is required');
    process.exit(1);
}

const fileName = argv.input;
fs.readFile(fileName, (err, body) => {
if (err) { throw err; }
const source = json5.parse(body);
const res = lib.renderAny(0, source, skins);
const svg = onml.stringify(res, argv.indent);
console.log(svg);
});
/* eslint no-console: 0 */
