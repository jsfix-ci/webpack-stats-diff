// const TABLE_HEADERS = ['Asset', 'Old size', 'New size', 'Diff', 'Diff %'];
const conditionalPercentage = number =>
  [Infinity, -Infinity].includes(number) ? '' : `${number.toFixed(2)} %`;
const capitalize = text => text[0].toUpperCase() + text.slice(1);

// const makeHeader = columns => {
//   return `${columns.join(' | ')}\n`
  // `${columns.join(' | ')}\n${columns
  //   .map(x =>
  //     Array.from(new Array(x.length))
  //       .map(() => '-')
  //       .join('')
  //   )
  //   .join(' | ')}\n`;
// }

const getSizeText = (size, isDiff) => {
  if (size === 0) {
    return '0';
  }

  const abbreviations = ['bytes', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(Math.abs(size)) / Math.log(1024));

  return (isDiff && size > 0 ? '+' : '') + `${+(size / Math.pow(1024, index)).toPrecision(3)} ${
    abbreviations[index]
  }`
};

function toGreen (str) {
  return `<font color="info">${str}</font>`
}

function toRed (str) {
  return `<font color="warning">${str}</font>`
}

// function toGray (str) {
//   return `<font color="comment">${str}</font>`
// }

function tintField(str, cb) {
  if (str === 'added' || str === 'bigger') {
    return toGreen(cb(str))
  }
  return toRed(cb(str))
}

function tintSize(str, size) {
  if (!str) return str
  if (size > 0) return toGreen(str)
  if (size < 0) return toRed(str)
  return str
}


const printAddedAndRemovedAssetTables = results => {
  return ['added', 'removed']
    .map(field => {
      const assets = results[field];
      if (assets.length === 0) {
        return;
      }

      // const columns = TABLE_HEADERS.slice(0, TABLE_HEADERS.length - 1);
      const header = ''; // makeHeader(columns);

      return `${tintField(field, capitalize)}\n\n${header}${assets.map(asset => {
        return `${asset.name}: ${getSizeText(asset.newSize)}, ${tintSize(getSizeText(asset.diff, true), asset.diff)}`
      }).join('\n')}`;
    })
    .filter(Boolean)
    .join('\n\n');
};

const printBiggerAndSmallerAssetTables = results => {
  return ['bigger', 'smaller']
    .map(field => {
      const assets = results[field];
      if (assets.length === 0) {
        return;
      }

      const header = ''; // makeHeader(TABLE_HEADERS);

      return `${tintField(field, capitalize)}\n\n${header}${assets.map(asset => {
        return `${asset.name}: ${getSizeText(asset.newSize)}(Old: ${getSizeText(asset.oldSize)}), ${tintSize(getSizeText(asset.diff, true), asset.diff)}(${tintSize(`${conditionalPercentage(asset.diffPercentage)}`, asset.diffPercentage)})`
      }).join('\n')}`;
    })
    .filter(Boolean)
    .join('\n\n');
};

const printTotalTable = total => {
  // const columns = TABLE_HEADERS.slice(1);
  const header = ''; // makeHeader(columns);

  let percent = `${conditionalPercentage(total.diffPercentage)}`
  let percentStr = percent ? `(${tintSize(percent, total.diffPercentage)})` : ''
  return `${capitalize(total.name)}\n\n${header}` + `${getSizeText(total.newSize)}(Old: ${getSizeText(total.oldSize)}), ${tintSize(getSizeText(total.diff, true), total.diff)}${percentStr}`;
};

module.exports = (statsDiff, skipPrint) => {
  const str = [
    printAddedAndRemovedAssetTables(statsDiff),
    printBiggerAndSmallerAssetTables(statsDiff),
    printTotalTable(statsDiff.total)
  ]
  .filter(s => s && s.trim())
  .join('\n')

  if (skipPrint) return str
  process.stdout.write(str + '\n');
};
