const commander = require('./commander');
const search = require('./search');
const download = require('./download');

module.exports = async () => {
  const resources = await search(commander);
  download(resources);
};
