const { program } = require('commander');
const pkg = require('../package.json');
const color = require('colorette');
const updateNotifier = require('update-notifier');

module.exports = (() => {
  const notifier = updateNotifier({ pkg, updateCheckInterval: 0 });
  if (notifier.update) {
    const { current, latest } = notifier.update;
    console.log(color.yellow('╭───────────────────────────────╮'));
    console.log(color.yellow('│                               │'));
    console.log(`${color.yellow('│   ')}有新版本啦~ ${color.gray(current)} → ${color.green(latest)}   ${color.yellow('│')}`);
    console.log(`${color.yellow('│   ')}Run ${color.cyan('npm i -g komic')}          ${color.yellow('│')}`);
    console.log(`${color.yellow('│   ')}or  ${color.cyan('yarn global add komic')}   ${color.yellow('│')}`);
    console.log(`${color.yellow('│   ')}or  ${color.cyan('pnpm add -g komic')}       ${color.yellow('│')}`);
    console.log(color.yellow('│                               │'));
    console.log(color.yellow('╰───────────────────────────────╯'));
  }

  program.name('comic').usage('<text>').version(pkg.version)
    .description('search comic and download');

  program.on('--help', () => {
    console.log('');
    console.log(color.greenBright('Examples'));
    console.log(`${color.cyan('    $ ')}comic 魔理沙`);
  });

  program.parse(process.argv);
  return program.args.join(' ');
})();
