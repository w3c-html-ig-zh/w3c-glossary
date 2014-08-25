/**
 * @fileOverview 词汇表数据渲染
 * @author Jinjiang <zhaojinjiang@me.com>
 */

// 完成 VM 绑定
new Vue({
  el: 'body',
  data: {
    /**
     * 词汇表列表，每一条数据都有 `en`(必填), `simplifed`, `traditional` 三个 html 字符串
     */
    glossary: glossary.filter(function (v) {
      return v && v.en && v.en.toUpperCase;
    }).sort(function (a, b) {
      return a.en.toUpperCase() > b.en.toUpperCase();
    }
  )},
  computed: {
    /**
     * 按照首字母排序+索引的结果
     * @return {Array} 形如 [key, wordList[{en, simplified, traditional}]]
     */
    initialIndex: function () {
      var initialMap = {};
      var initialIndex = [];

      this.$data.glossary.forEach(function (word) {
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
  }
});