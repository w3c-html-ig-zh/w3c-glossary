/**
 * Util
 */

var Mustache = require('mustache');
var fs = require('fs-extra');
var path = require('path');

function readJSON(filepath) {

  return fs.readJsonSync(filepath, {throws: false});
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




/**
 * Input
 */

var glossary;
var initialIndex;

function inputData() {
  var data = readJSON(path.join('data', 'glossary.json')) || [];
  glossary = buildGlossary(data);
  initialIndex = buildInitialIndex(glossary);
}

function buildGlossary(data) {
  return data.filter(function (v) {
    return v && (typeof v.en === 'string');
  }).sort(function (a, b) {
    return a.en.toUpperCase() > b.en.toUpperCase();
  });
}

function buildInitialIndex(glossary) {
  var initialMap = {};
  var initialIndex = [];

  glossary.forEach(function (word) {
    var initial;

    if (!word || !word.en) {
      return;
    }
    
    initial = word.en[0].toUpperCase();

    if (initial.match(/[0-9]/)) {
      // 数字开头词汇
      if (!initialMap['0']) {
        initialMap['0'] = [];
      }
      initialMap['0'].push(word);
    }
    else if (initial.match(/[A-Z]/)) {
      // 字母开头词汇
      if (!initialMap[initial]) {
        initialMap[initial] = [];
      }
      initialMap[initial].push(word);
    }
    else {
      // 其它特殊字符开头词汇
      if (!initialMap._) {
        initialMap._ = [];
      }
      initialMap._.push(word);
    }
  });

  Object.keys(initialMap).sort().forEach(function (key) {
    initialIndex.push({key: key, wordList: initialMap[key]});
  });

  return initialIndex;
}





/**
 * Convertor
 */

var htmlTemplate = getTemplate(path.join('lib', 'template.html')) || '';
var mdTemplate = getTemplate(path.join('lib', 'template.md')) || ''; // TODO: finish markdown template

function data2HTML(data) {
  return render(htmlTemplate, data);
}

function data2Markdown(data) {
  return render(mdTemplate, data);
}




/**
 * Output
 */

function build(data, format, filename) {
  var output;

  switch (format) {
    case 'markdown':
    case 'mdown':
    case 'md':
    output = data2Markdown(data);
    default:
    output = data2HTML(data);
  }

  writeFile((filename || 'index') + '.' + (format || 'html'), output);
}




/**
 * Runtime
 */

function init() {
  var argv, length, format;

  inputData();

  argv = readArgv();
  length = argv.length;

  if (length === 1) {
    format = argv[0];
  }
  else if (length > 1) {
    return;
  }

  build({initialIndex: initialIndex}, format);
}

init();




