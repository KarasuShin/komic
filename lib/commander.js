const { program } = require('commander');
const pkg = require('../package.json');
const color = require('colorette');
const updateNotifier = require('update-notifier');

module.exports = (() => {
  const notifier = updateNotifier({ pkg }).notify();
  notifier.notify();

  program.name('comic').usage('<text>').version(pkg.version)
    .description('search comic and download')
    .action(args => {
    });

  program.on('--help', () => {
    console.log('');
    console.log(color.greenBright('Examples'));
    console.log(`${color.cyan('    $ ')}comic One Piece`);
  });

  program.parse(process.argv);
  return program.args.join(' ');
})();
