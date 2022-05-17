const { request } = require('./request');
const fs = require('fs');
const { SingleBar, Presets } = require('cli-progress');
const { cyan } = require('colorette');
const Bagpipe = require('bagpipe');
const bagpipe = new Bagpipe(10);

const progress = new SingleBar({
  format: `下载进度 ${cyan('{bar}')} {percentage}%  {value}/{total}`,
  hideCursor: true,
}, Presets.shades_classic);

const download = async (src, filename) => {
  const res = await request.get(encodeURI(src), {
    responseType: 'stream'
  });
  res.data.pipe(fs.createWriteStream(filename));
  res.data.on('end', () => {
    progress.increment();
    if(progress.value === progress.total) {
      progress.stop();
      console.log(cyan('下载完成'));
    }
  });
};

const downloadChapter = async (path, pages) => {
  if(!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  pages.forEach((src, index) => {
    bagpipe.push(async (cb) => {
      const filepath = `${path}/${index+1}.${src.split('.').pop()}`;
      await download(src, filepath);
      cb();
    });
  });
};

module.exports = async (resource) => {
  const { sum, task, name } = resource;
  const comicPath = `./${name}`;
  if(!fs.existsSync(comicPath)) {
    fs.mkdirSync(comicPath);
  }

  progress.start(sum, 0);
  task.forEach(item => downloadChapter(`${comicPath}/${item.chapter_name}`, item.page_url));
};
