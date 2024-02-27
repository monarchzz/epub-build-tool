import { newTab } from "../common/browser.js";
import { imageToHtml } from "../common/tesseract.js";
import fs from "fs";

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function contentByUrl(url, { chapter, name }) {
  const basePath = `out/${name}`;

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  const imagePath = `${basePath}/${chapter}.png`;
  let timeout = 1 * 1000;
  const isImageExist = fs.existsSync(imagePath);

  if (isImageExist) {
    timeout = 1 * 1000;
  }

  console.log(
    `Image Path: ${imagePath} - Is Image Exist: ${isImageExist} - Timeout: ${timeout} - URL: ${url}`
  );

  const page = await newTab();

  // await page.setCookie();

  await page.setViewport({
    width: 1200,
    height: 100000,
  });

  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  return await new Promise((resolve) => {
    setTimeout(async () => {
      try {
        // await autoScroll(page);

        const title = await page.$eval(".nh-read__title", (element) => {
          return element.textContent;
        });

        // screenshot
        if (!isImageExist) {
          const element = await page.$("#article");

          await element.screenshot({
            path: imagePath,
          });
        }
        // with tessaract
        // const content = await imageToHtml(imagePath);

        // without tessaract
        const article = await page.$eval("#article", (element) => {
          element.querySelectorAll("div").forEach((div) => div.remove());

          return element.innerHTML;
        });
        const content = `<div>${article}</div>`;

        resolve({
          id: chapter,
          title,
          content,
        });
      } catch (e) {
        console.log(e);
        console.log(`Error crawling ${url}`);

        resolve({
          id: chapter,
          title: `Chapter not found`,
          content: `<div></div>`,
        });
      } finally {
        await page.close();
      }
    }, timeout);
  });
}

async function tessaractWithImages(name, chapter, index) {
  const imagePath = `out/images/${name + "-" + chapter}.png`;
  const jsonString = await fs.promises.readFile(
    `out/json/${name}.json`,
    "utf-8"
  );
  const json = JSON.parse(jsonString);
  const item = json[index];
  const title = item.title;

  console.log(`Tessaract with images: ${imagePath} - ${title} - ${index}`);

  const content = await imageToHtml(imagePath);

  return {
    title,
    content,
  };
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
        const jsonIndex = chapter - startChapter;

        console.log(`Crawling chapter ${chapter}...`);

        return contentByUrl(`${baseUrl}${chapter}`, {
          chapter,
          name: "tuc-menh-chi-hoan",
        });

        // return tessaractWithImages("quy-bi-chi-chu", chapter, jsonIndex);
      })
    );

    // push each chapter to data
    contents.forEach((content, index) => {
      data.push(content);
    });
  }

  // sort data by id
  data.sort((a, b) => a.id - b.id);

  return data;
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

async function quyBiChiChu({ startChapter, totalChapters, step = 10 }) {
  const baseUrl = "https://metruyencv.com/truyen/quy-bi-chi-chu/chuong-";

  const data = await batchCrawl({
    baseUrl,
    totalChapters,
    step,
    startChapter,
  });

  return data;
}

async function tucMenhChiHoan({ startChapter, totalChapters, step = 10 }) {
  const baseUrl = "https://metruyencv.com/truyen/tuc-menh-chi-hoan/chuong-";

  const data = await batchCrawl({
    baseUrl,
    totalChapters,
    step,
    startChapter,
  });

  return data;
}

export { vanCoThanDe, taCoMotThanBiDongKy, quyBiChiChu, tucMenhChiHoan };
