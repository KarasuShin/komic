const { request } = require('./request');
const fs = require('fs');
const { SingleBar, Presets } = require('cli-progress');
const { cyan } = require('colorette');

const progress = new SingleBar({
  format: `下载进度 ${cyan('{bar}')} {percentage}%  {value}/{total}`,
  hideCursor: true,
}, Presets.shades_classic);

const download = async (src, filename) => {
  return new Promise(async (resolve, reject) => {
    const res = await request.get(encodeURI(src), {
      responseType: 'stream'
    });
    res.data.pipe(fs.createWriteStream(filename));
    res.data.on('end', () => {
      progress.increment();
      resolve();
    });
  });
};

const downloadChapter = async (path, pages) => {
  if(!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  const queue = pages.map((src, index) => {
    const filepath = `${path}/${index+1}.${src.split('.').pop()}`;
    return () => download(src, filepath);
  });
  await queuePromise(queue);
};

const queuePromise = async (queue) => {
  for (let promiseFn of queue) {
    await promiseFn();
  }
};

module.exports = async (resource) => {
  const { sum, task, name } = resource;
  const comicPath = `./${name}`;
  if(!fs.existsSync(comicPath)) {
    fs.mkdirSync(comicPath);
  }

  const queue = task.map(item => () => downloadChapter(`${comicPath}/${item.chapter_name}`, item.page_url));
  progress.start(sum, 0);
  await queuePromise(queue);
  progress.stop();
  console.log(cyan('下载完成'));
};