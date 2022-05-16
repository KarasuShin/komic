const { red, cyan, greenBright, bold } = require('colorette');
const { search, getResource, getTaskInfo } = require('./request');
const prompts = require('prompts');

module.exports = async (text) => {
  if(!text.replaceAll(' ','')) {
    console.error(red('please input comic name!'));
    process.exit(1);
  }
  try {
    const res = await search(text);
    if(!res?.length) {
      console.error(red('没有搜索到相关资源'));
      process.exit(1);
    }
    const comicChoice = await prompts([{
      type: 'select',
      name: 'comic',
      message: '选择要下载的漫画',
      choices: res.map(item => ({
        title: `${item.comic_name} ${bold(greenBright(item.comic_author))}`,
        value: item
      }))
    }]);
    return await getResource(comicChoice.comic.id, comicChoice.comic.comic_name);
  } catch (error) {
    console.error(red(error));
    process.exit(1);
  }
};
