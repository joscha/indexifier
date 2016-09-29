#!/usr/bin/env node
const program = require('commander');
const { version } = require('../package.json');
const indexifier = require('../');

function list(val) {
  return val.split(',');
}

program
  .version(version)
  .usage('[options] <dir>')
  .arguments('<dir>')
  .option('-e, --extensions <list>', 'The extensions to take into account; defaults to .htm,.html', list, ['.html', '.htm'])
  .option('-h, --html', 'Enable to generate HTML output')
  .action((dir) => {
    try {
      console.log(indexifier(dir, {
          fileTypes: program.extensions,
          isHtml: program.html
      }));
    } catch(e) {
      console.error(e.message);
      process.exit(1);
    }
  })
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
