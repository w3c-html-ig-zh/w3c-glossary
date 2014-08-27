/**
 * Merge Glossary from JSON file
 */

var path = require('path');
var util = require('./util');

var glossaryMap = {};

function importData(filepath, needMergeExisted) {
  var data = util.readJSON(filepath) || [];
  data.forEach(function (item) {
    mergeItem(item, needMergeExisted);
  });
}

function mergeItem(item, needMergeExisted) {
  if (!item) {
    return;
  }

  var en = item.en;
  var simplified = item.simplified;
  var traditional = item.traditional;

  if (!en) {
    return;
  }

  if (!glossaryMap[en]) {
    glossaryMap[en] = {};
    glossaryMap[en].en = en;
  }

  if (simplified) {
    if (!glossaryMap[en].simplified || needMergeExisted) {
      glossaryMap[en].simplified = simplified;
    }
  }

  if (traditional) {
    if (!glossaryMap[en].traditional || needMergeExisted) {
      glossaryMap[en].traditional = traditional;
    }
  }
}

function exportData(filepath) {
  var glossary = parseGlossary(glossaryMap);
  var output = glossaryToString(glossary);
  util.writeFile(path.join('data', filepath || 'glossary.json.tmp'), output);
}

function parseGlossary(glossaryMap) {
  var glossary = [];

  for (var en in glossaryMap) {
    glossary.push(glossaryMap[en]);
  }

  glossary = glossary.filter(function (v) {
    return v && (typeof v.en === 'string');
  });

  glossary.sort(function (a, b) {
    return a.en.toUpperCase() > b.en.toUpperCase();
  });

  return glossary;
}

function glossaryToString(glossary) {
  var substringList;

  substringList = glossary.map(function (item) {
    return '  {"en": "' + encodeQuote(item.en) +
        '", "simplified": "' + encodeQuote(item.simplified) +
        '", "traditional": "' + encodeQuote(item.traditional) + '"}';
  });

  return '[\n' + substringList.join(',\n') + '\n]';
}

function encodeQuote(str) {
  return (str || '').replace(/"/g, '\\"');
}




/**
 * Runtime
 */

function init() {

  importData(path.join('data', 'glossary.json'));
  importData(path.join('data', 'import.json'), true);

  exportData();
}

init();




