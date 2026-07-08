#!/usr/bin/env node
'use strict';

// Build the browser bundle as UMD so it loads via <script>, AMD (RequireJS,
// Observable's require) and CommonJS. esbuild only emits IIFE, so we wrap its
// global-name output in a UMD shim through banner/footer.

const esbuild = require('esbuild');
const pkg = require('../package.json');

const name = 'wavedrom';
const minify = process.argv.includes('--minify');

const t = new Date();
const header = [
    '/*!', pkg.name, pkg.version,
    [t.getFullYear(), t.getMonth() + 1, t.getDate()].join('-'),
    'PDT', '*/'
].join(' ');

const umdBanner =
    '(function(root,factory){' +
        'if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=factory();}' +
        'else if(typeof define==="function"&&define.amd){define([],factory);}' +
        'else{(typeof globalThis!=="undefined"?globalThis:root||self)["' + name + '"]=factory();}' +
    '}(this,function(){';

const umdFooter = 'return ' + name + ';}));';

esbuild.buildSync({
    entryPoints: ['./lib/index.js'],
    bundle: true,
    format: 'iife',
    globalName: name,
    minify,
    banner: {js: header + '\n' + umdBanner},
    footer: {js: umdFooter},
    outfile: minify ? 'wavedrom.unpkg.min.js' : 'wavedrom.unpkg.js'
});
