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

const setCookie = async (page) => {
  await page.setCookie(
    {
      domain: ".metruyencv.com",
      expirationDate: 1745165106.361595,
      hostOnly: false,
      httpOnly: true,
      name: "cf_clearance",
      path: "/",
      sameSite: "None",
      secure: true,
      session: false,
      storeId: "0",
      value:
        "Jmfl8ZzKNWTEL07T7VyQFnkpWcPkTCLhXQfgnT9.AyI-1713629106-1.0.1.1-sWJctIky4tCzCOZgC1irYMYx0eTI2h1QHaPZZWFs_8rgOw2xyLKSkiGYSP7jyC27RmjqnTeLNb7kvCoOoo56TQ",
      id: 1,
    },
    {
      domain: "metruyencv.com",
      expirationDate: 1714838795,
      hostOnly: true,
      httpOnly: false,
      name: "l_token",
      path: "/",
      sameSite: "Strict",
      secure: false,
      session: false,
      storeId: "0",
      value:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLnRydXllbi5vbmxcL3YyXC9hdXRoXC9sb2dpbiIsImlhdCI6MTcxMzYyOTE5NSwiZXhwIjoxNzE0MDYxMTk1LCJuYmYiOjE3MTM2MjkxOTUsImp0aSI6ImN6eFNzYTRtY0dJSVMxRXEiLCJzdWIiOjE0NTc0NzQsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.fECDPULaidL7r-boQ1fO_U_ua1otYiTDVmujNEXndzQ",
      id: 2,
    },
    {
      domain: "metruyencv.com",
      expirationDate: 1748189201.453259,
      hostOnly: true,
      httpOnly: true,
      name: "metruyenchucom_session",
      path: "/",
      sameSite: "Lax",
      secure: true,
      session: false,
      storeId: "0",
      value:
        "eyJpdiI6Ik1OdmRXdHhlc3BIWVJhQTlBUDF3NFE9PSIsInZhbHVlIjoiZktcL0txYmVJZDRMcStZZjBEVHBcL3RuU20rOWEyRTQzN2F0R3hqUHh4bTMrUXVxdHJicTBmMjhtZHNrS0FZbU5rIiwibWFjIjoiZjM2NDYxOTUwMGM3NWVmZDlkODNmY2VjMGZkNDg0NDA3NDI5ZDU0YjMzYjUzNDJmMGUwNjE1OWZhNjkzNmZiNSJ9",
      id: 3,
    },
    {
      domain: "metruyencv.com",
      expirationDate: 1714838795,
      hostOnly: true,
      httpOnly: false,
      name: "r_token",
      path: "/",
      sameSite: "Strict",
      secure: false,
      session: false,
      storeId: "0",
      value:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLnRydXllbi5vbmxcL3YyXC9hdXRoXC9sb2dpbiIsImlhdCI6MTcxMzYyOTE5NSwiZXhwIjoxNzE0MDYxMTk1LCJuYmYiOjE3MTM2MjkxOTUsImp0aSI6ImN6eFNzYTRtY0dJSVMxRXEiLCJzdWIiOjE0NTc0NzQsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.fECDPULaidL7r-boQ1fO_U_ua1otYiTDVmujNEXndzQ",
      id: 4,
    }
  );
};

async function contentByUrl(url, { chapter, basePath, withTessaract }) {
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  const imagesPath = `${basePath}/images`;
  if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath, { recursive: true });
  }

  const imagePath = `${imagesPath}/${chapter}.png`;
  let timeout = 1 * 1000;

  if (withTessaract) {
    timeout = 60 * 1000;
  }

  const isImageExist = fs.existsSync(imagePath);

  if (isImageExist) {
    timeout = 1 * 1000;
  }

  console.log(
    `Image Path: ${imagePath} - Is Image Exist: ${isImageExist} - Timeout: ${timeout} - URL: ${url}`
  );

  const page = await newTab();

  // await setCookie(page);

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

        const chapterElement = await page.$(`[data-x-data="chapter"]`);

        const title = await chapterElement.$eval(
          `.flex.justify-center.space-x-2.items-center.px-2`,
          (element) => {
            return element.textContent.trim();
          }
        );

        // screenshot
        if (!isImageExist) {
          const element = await page.$(`[data-x-bind="ChapterContent"]`);

          await element.screenshot({
            path: imagePath,
          });
        }

        let content = "";

        if (withTessaract) {
          // with tessaract
          // content = await imageToHtml(imagePath);
        } else {
          // without tessaract
          const article = await page.$eval(
            `[data-x-bind="ChapterContent"]`,
            (element) => {
              element.querySelectorAll("div").forEach((div) => div.remove());

              return element.innerHTML.trim();
            }
          );
          content = `<div>${article}</div>`;
        }

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
  basePath,
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
          basePath,
          withTessaract: chapter > 1030,
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

async function tathatkhongmuontrongsinha({
  startChapter,
  totalChapters,
  step = 10,
}) {
  const baseUrl =
    "https://metruyencv.com/truyen/ta-that-khong-muon-trong-sinh-a/chuong-";

  const data = await batchCrawl({
    baseUrl,
    totalChapters,
    step,
    startChapter,
  });

  return data;
}

async function tientuxinnghetagiaithich({
  startChapter,
  totalChapters,
  step = 10,
  basePath,
}) {
  const baseUrl =
    "https://metruyencv.com/truyen/tien-tu-xin-nghe-ta-giai-thich/chuong-";

  const data = await batchCrawl({
    baseUrl,
    totalChapters,
    step,
    startChapter,
    basePath,
  });

  return data;
}

export {
  vanCoThanDe,
  taCoMotThanBiDongKy,
  quyBiChiChu,
  tucMenhChiHoan,
  tathatkhongmuontrongsinha,
  tientuxinnghetagiaithich,
};
