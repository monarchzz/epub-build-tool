import { newTab } from "../common/browser.js";

async function contentByUrl(url) {
  const page = await newTab();

  await page.goto(url);
  try {
    const article = await page.$eval("#article", (element) => {
      element.querySelectorAll("div").forEach((div) => div.remove());

      return element.innerHTML;
    });

    const title = await page.$eval(".nh-read__title", (element) => {
      return element.textContent;
    });

    return {
      title,
      data: `<div>${article}</div>`,
    };
  } catch (e) {
    console.log(e);
    console.log(`Error crawling ${url}`);

    return {
      title: `Chapter not found`,
      data: `<div></div>`,
    };
  } finally {
    await page.close();
  }
}

async function batchCrawl({
  baseUrl,
  totalChapters,
  startChapter = 1,
  step = 10,
}) {
  const data = [];

  for (let i = startChapter; i <= totalChapters; i += step) {
    console.log(`Crawling chapter ${i} to ${i + step - 1}...`);

    const numberOfChapters =
      i + step - 1 > totalChapters ? totalChapters - i + 1 : step;
    console.log(`Number of chapters: ${numberOfChapters}`);

    const contents = await Promise.all(
      Array.from({ length: numberOfChapters }, (_, index) => {
        const chapter = i + index;

        console.log(`Crawling chapter ${chapter}...`);

        return contentByUrl(`${baseUrl}${chapter}`);
      })
    );

    // push each chapter to data
    contents.forEach((content, index) => {
      data.push({
        id: i + index,
        ...content,
      });
    });
  }

  // sort data by id
  data.sort((a, b) => a.id - b.id);

  return data.map((item) => ({
    title: item.title,
    data: item.data,
  }));
}

async function vanCoThanDe() {
  const totalChapters = 10;
  const baseUrl = "https://metruyencv.com/truyen/van-co-than-de/chuong-";

  const data = await batchCrawl({ baseUrl, totalChapters });

  return data;
}

async function taCoMotThanBiDongKy() {
  const totalChapters = 1431;
  const baseUrl =
    "https://metruyencv.com/truyen/ta-co-mot-than-bi-dong-ky/chuong-";

  const data = await batchCrawl({ baseUrl, totalChapters, step: 50 });

  return data;
}

async function quyBiChiChu() {
  const totalChapters = 300;
  const baseUrl = "https://metruyencv.com/truyen/quy-bi-chi-chu/chuong-";

  const data = await batchCrawl({
    baseUrl,
    totalChapters,
    step: 10,
  });

  return data;
}

export { vanCoThanDe, taCoMotThanBiDongKy, quyBiChiChu };
