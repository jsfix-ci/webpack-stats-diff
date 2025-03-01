#!/usr/bin/env node
const program = require('commander');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { getStatsDiff, printTerminalDiff, printMarkdownDiff, printWeWorkDiff } = require('./');

const printError = text => {
  console.error(chalk.red(text));
  process.exit(1);
};

const checkPathExists = p => {
  if (!fs.existsSync(p)) {
    printError(`Error: ${p} does not exist!`);
  }
};

program
  .arguments('<old-stats.json> <new-stats.json>')
  .option(
    '-e, --extensions <ext>',
    'Filter assets by extension. Comma separate.'
  )
  .option(
    '-t, --threshold <int>',
    'minimum % size change to report. Default 5.',
    parseInt
  )
  .addOption(
    new program.Option(
      '--type <type>',
      'Prints the diff stats in type',
      'terminal'
    ).choices(['markdown', 'terminal', 'wework'])
  )
  .action((oldStats, newStats) => {
    const config = {};
    const options = program.opts();
    if (options.extensions) {
      config.extensions = options.extensions.split(',');
    }
    if (Number.isInteger(options.threshold)) {
      config.threshold = options.threshold;
    }
    const oldPath = path.resolve(process.cwd(), oldStats);
    const newPath = path.resolve(process.cwd(), newStats);

    checkPathExists(oldPath);
    checkPathExists(newPath);

    const oldAssets = require(oldPath).assets;
    const newAssets = require(newPath).assets;
    const statsDiff = getStatsDiff(oldAssets, newAssets, config);

    
    switch (options.type) {
      case 'markdown':
        printMarkdownDiff(statsDiff);
        break;
      case 'wework': 
        printWeWorkDiff(statsDiff);
        break;
      default:
        printTerminalDiff(statsDiff);
        break;
    }
  })
  .on('--help', () => {
    console.log();
    console.log('  Examples:');
    console.log(
      '    $ webpack-stats-diff master-stats.json stats.json --extensions js,jsx'
    );
  })
  .parse(process.argv);

if (!program.args.length) {
  program.help();
}
