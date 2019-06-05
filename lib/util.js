/**
 * Util
 */

var Mustache = require('mustache');
var fs = require('fs-extra');
var YAML = require('yaml');

function readJSON(filepath) {
  return fs.readJsonSync(filepath, {throws: false});
}

function readYAML(filepath) {
  return YAML.parse(fs.readFileSync(filepath, {encoding: 'utf-8'}));
}

function getTemplate(filepath) {
  return fs.readFileSync(filepath, {encoding: 'utf-8'});
}

function writeFile(filename, data) {
  fs.outputFileSync(filename, data);
}

function render(template, data) {
  return Mustache.render(template, data);
}

function readArgv() {
  // $ node process-2.js one two=three four
  // 0: node
  // 1: /Users/mjr/work/node/process-2.js
  // 2: one
  // 3: two=three
  // 4: four

  return Array.prototype.slice.call(process.argv, 2);
}

exports.readJSON = readJSON;
exports.readYAML = readYAML;
exports.getTemplate = getTemplate;
exports.writeFile = writeFile;
exports.render = render;
exports.readArgv = readArgv;



