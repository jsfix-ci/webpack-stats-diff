const { getAssetsDiff, getStatsDiff } = require('./getStatsDiff');
const printTerminalDiff = require('./print/terminal');
const printMarkdownDiff = require('./print/markdown');

module.exports = {
  getAssetsDiff,
  getStatsDiff,
  printTerminalDiff,
  printMarkdownDiff,
};
