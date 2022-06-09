import axios from 'axios';
import type { ChapterItem, ComicInfo } from './types';
const request = axios.create();

request.interceptors.request.use(config => {
  config.headers = {
    Referer: 'https://m.dmzj.com'
  };
  return config;
});

const search = async (text: string) => {
  const res = await request.get<string>('http://sacg.dmzj.com/comicsum/search.php', {
    params: { s: text }
  });
  const { data } = res;
  const list = data.match(/var g_search_data = (.*);/);
  if (list?.[1]) {
    try {
      return JSON.parse(list[1]) as ComicInfo[];
    } catch {
      throw ('查询失败');
    }
  }
};

const getResource = async (cid: string, name: string) => {
  const res = await request.get(`https://api.dmzj.com/dynamic/comicinfo/${cid}.json`);
  const taskInfo = await getTaskInfo(res.data.data.list);
  return {
    name,
    ...taskInfo
  };
};

const getTaskInfo = async (chapterList: ChapterItem[]) => {
  const task = await Promise.all(chapterList.map(item => getChapterInfo(item.comic_id, item.id)));
  const sum = task.map(item => item.page_url.length).reduce((acr, cur) => acr + cur);
  return {
    sum,
    task
  };
};

const getChapterInfo = async (comicId: string, chapterId: string) => {
  const res = await request.get(`https://m.dmzj.com/chapinfo/${comicId}/${chapterId}.html`);
  const { page_url, chapter_name } = res.data;
  return {
    chapter_name,
    page_url
  };
};

export {
  search,
  getResource,
  getTaskInfo,
  request
};
