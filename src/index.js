const { getAssetsDiff, getStatsDiff } = require('./getStatsDiff');
const printTerminalDiff = require('./print/terminal');
const printMarkdownDiff = require('./print/markdown');
const printWechatWorkDiff = require('./print/wechat-work');

module.exports = {
  getAssetsDiff,
  getStatsDiff,
  printTerminalDiff,
  printMarkdownDiff,
  printWechatWorkDiff
};
