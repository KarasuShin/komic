import commander from './commander';
import search from './search';
import download from './download';

export * from './types';

(async function run() {
  const resources = await search(commander());
  download(resources);
})();
