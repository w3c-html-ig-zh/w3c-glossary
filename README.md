W3C Glossary Translation
========================

本專案緣起：http://lists.w3.org/Archives/Public/public-html-ig-zh/2011Mar/0160.html

## 维护办法

### 准备工作

0. 首先确保您有正常工作的 Node.js 和 NPM 环境
1. 把这个项目 `fork` 到个人的空间
2. 把个人空间的项目克隆到本地
3. 运行 `npm install` 安装必要的库

### 修改词汇表

打开 `data` 目录下的 `glossary.json` 文件，增/删/改相应的字段。

### 生成页面

**提交之前千万记得**运行 `npm run build` 即可更新 `index.html`。

**提示：**你在修改过程中可以随时生成页面进行预览。
