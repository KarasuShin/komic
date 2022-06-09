import { request } from './request';
import fs from 'fs';
import { SingleBar, Presets } from 'cli-progress';
import { cyan } from 'colorette';
import PQueue from 'p-queue';
import type { TaskItem } from './types';
const queue = new PQueue({ concurrency: 10 });

const progress = new SingleBar({
  format: `下载进度 ${cyan('{bar}')} {percentage}%  {value}/{total}`,
  hideCursor: true,
}, Presets.shades_classic);

const download = async (src: string, filename: string) => {
  const res = await request.get(encodeURI(src), {
    responseType: 'stream'
  });
  res.data.pipe(fs.createWriteStream(filename));
  res.data.on('end', () => {
    progress.increment();
    if (progress.getProgress() === 1) {
      progress.stop();
      console.log(cyan('下载完成'));
    }
  });
};

const downloadChapter = (path: string, pages: string[]) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  pages.forEach((src, index) => {
    queue.add(async () => {
      const filepath = `${path}/${index + 1}.${src.split('.').pop()}`;
      await download(src, filepath);
    });
  });
};

export default function (resource: {
  sum: number
  task: TaskItem[]
  name: string
}) {
  const { sum, task, name } = resource;
  const comicPath = `./${name}`;
  if (!fs.existsSync(comicPath)) {
    fs.mkdirSync(comicPath);
  }

  progress.start(sum, 0);
  task.forEach(item => downloadChapter(`${comicPath}/${item.chapter_name}`, item.page_url));
}
