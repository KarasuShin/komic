const axios = require('axios');
const request = axios.create();

request.interceptors.request.use(config => {
  config.headers = {
    Referer: 'https://m.dmzj.com'
  };
  return config;
});

const timeout = 6e4;

const search = (text) => {
  return new Promise(async (resolve, reject) => {
    const res = await request.get('http://sacg.dmzj.com/comicsum/search.php', {
      params: { s: text }
    });
    const { data } = res;
    const list = data.match(/var g_search_data = (.*);/);
    if(list?.[1]) {
      try {
        resolve(JSON.parse(list[1]));
      } catch {
        reject('查询失败');
      }
    }
  });
};

const getResource = (cid, name) => {
  return new Promise(async (resolve, reject) => {
    const res = await request.get(`https://api.dmzj.com/dynamic/comicinfo/${cid}.json`);
    const taskInfo = await getTaskInfo(res.data.data.list);
    resolve({
      name,
      ...taskInfo
    });
  });
};

const getTaskInfo = async (chapterList) => {
  return new Promise(async (resolve, reject) => {
    const task = await Promise.all(chapterList.map(item => getChapterInfo(item.comic_id, item.id)));
    const sum = task.map(item => item.page_url.length).reduce((acr, cur) => acr + cur);
    resolve({
      sum,
      task
    });
  });
};

const getChapterInfo = async (comicId, chapterId) => {
  return new Promise(async (resolve, reject) => {
    const res = await request.get(`https://m.dmzj.com/chapinfo/${comicId}/${chapterId}.html`);
    const { page_url, chapter_name } = res.data;
    resolve({
      chapter_name,
      page_url
    });
  });
};

module.exports = {
  search,
  getResource,
  getTaskInfo,
  request
};
