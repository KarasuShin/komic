import { program } from 'commander';
import pkg from '../package.json';
import { yellow, cyan, green, gray, greenBright } from 'colorette';
import updateNotifier from 'update-notifier';

export default function () {
  const notifier = updateNotifier({ pkg, updateCheckInterval: 0 });
  if (notifier.update) {
    const { current, latest } = notifier.update;
    console.log(yellow('╭───────────────────────────────╮'));
    console.log(yellow('│                               │'));
    console.log(`${yellow('│   ')}有新版本啦~ ${gray(current)} → ${green(latest)}   ${yellow('│')}`);
    console.log(`${yellow('│   ')}Run ${cyan('npm i -g komic')}          ${yellow('│')}`);
    console.log(`${yellow('│   ')}or  ${cyan('yarn global add komic')}   ${yellow('│')}`);
    console.log(`${yellow('│   ')}or  ${cyan('pnpm add -g komic')}       ${yellow('│')}`);
    console.log(yellow('│                               │'));
    console.log(yellow('╰───────────────────────────────╯'));
  }

  program.name('comic').usage('<text>').version(pkg.version)
    .description('search comic and download');

  program.on('--help', () => {
    console.log('');
    console.log(greenBright('Examples'));
    console.log(`${cyan('    $ ')}comic 魔理沙`);
  });

  program.parse(process.argv);
  return program.args.join(' ');
}
