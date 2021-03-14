const { getAssetsDiff, getStatsDiff } = require('./getStatsDiff');
const printTerminalDiff = require('./print/terminal');
const printMarkdownDiff = require('./print/markdown');
const printWeWorkDiff = require('./print/wework');

module.exports = {
  getAssetsDiff,
  getStatsDiff,
  printTerminalDiff,
  printMarkdownDiff,
  printWeWorkDiff
};
