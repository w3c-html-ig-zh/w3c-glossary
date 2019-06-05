/**
 * Util
 */

var path = require('path');
var util = require('./util');




/**
 * Input
 */

var glossary;
var initialIndex;

function inputData() {
  var data = util.readYAML(path.join('data', 'glossary.yaml')) || [];
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

var htmlTemplate = util.getTemplate(path.join('lib', 'template.html')) || '';
var mdTemplate = util.getTemplate(path.join('lib', 'template.md')) || ''; // TODO: finish markdown template

function data2HTML(data) {
  return util.render(htmlTemplate, data);
}

function data2Markdown(data) {
  return util.render(mdTemplate, data);
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

  util.writeFile((filename || 'index') + '.' + (format || 'html'), output);
}




/**
 * Runtime
 */

function init() {
  var argv, length, format;

  inputData();

  argv = util.readArgv();
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




