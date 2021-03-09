const TABLE_HEADERS = ['Asset', 'Old size', 'New size', 'Diff', 'Diff %'];
const conditionalPercentage = number =>
  [Infinity, -Infinity].includes(number) ? '-' : `${number.toFixed(2)} %`;
const capitalize = text => text[0].toUpperCase() + text.slice(1);

const makeHeader = columns =>
  `${columns.join(' | ')}\n${columns
    .map(x =>
      Array.from(new Array(x.length))
        .map(() => '-')
        .join('')
    )
    .join(' | ')}\n`;

const getSizeText = size => {
  if (size === 0) {
    return '0';
  }

  const abbreviations = ['bytes', 'KiB', 'MiB', 'GiB'];
  const index = Math.floor(Math.log(Math.abs(size)) / Math.log(1024));

  return `${+(size / Math.pow(1024, index)).toPrecision(3)} ${
    abbreviations[index]
  }`;
};

const printAddedAndRemovedAssetTables = results => {
  return ['added', 'removed']
    .map(field => {
      const assets = results[field];
      if (assets.length === 0) {
        return;
      }

      const columns = TABLE_HEADERS.slice(0, TABLE_HEADERS.length - 1);
      const header = makeHeader(columns);

      return `\n\n**${capitalize(field)}**\n\n${header}${assets.map(asset => {
        return [
          asset.name,
          getSizeText(asset.oldSize),
          getSizeText(asset.newSize),
          getSizeText(asset.diff)
        ].join(' | ');
      })}`;
    })
    .join('');
};

const printBiggerAndSmallerAssetTables = results => {
  return ['bigger', 'smaller']
    .map(field => {
      const assets = results[field];
      if (assets.length === 0) {
        return;
      }

      const header = makeHeader(TABLE_HEADERS);

      return `\n\n**${capitalize(field)}**\n\n${header}${assets.map(asset => {
        return [
          asset.name,
          getSizeText(asset.oldSize),
          getSizeText(asset.newSize),
          getSizeText(asset.diff),
          `${conditionalPercentage(asset.diffPercentage)}`
        ].join(' | ');
      })}`;
    })
    .join('');
};

const printTotalTable = total => {
  const columns = TABLE_HEADERS.slice(1);
  const header = makeHeader(columns);

  return `\n\n**${capitalize(total.name)}**\n\n${header}${[
    total.name,
    getSizeText(total.oldSize),
    getSizeText(total.newSize),
    getSizeText(total.diff),
    `${conditionalPercentage(total.diffPercentage)}`
  ].join(' | ')}`;
};

module.exports = statsDiff => {
  process.stdout.write(printAddedAndRemovedAssetTables(statsDiff));
  process.stdout.write(printBiggerAndSmallerAssetTables(statsDiff));
  process.stdout.write(printTotalTable(statsDiff.total));
};
