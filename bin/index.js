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
  .option('-H, --html', 'Enable to generate HTML output')
  .option('-L, --no-link-folders', 'Do not link folders when in HTML output mode')
  .option('-F, --no-empty-directories', 'Do not include empty directories')
  .option('-E, --exclude <regexp>', 'Exclude files and directories that are matched by this regular expression')
  .option('-D, --max-depth <number>', 'Limit results to a maximum sub-directory depth')
  .action((dir) => {
    try {
      console.log(indexifier(dir, {
          exclude: program.exclude,
          fileTypes: program.extensions,
          isHtml: program.html,
          linkFolders: program.linkFolders,
          maxDepth: program.maxDepth,
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
