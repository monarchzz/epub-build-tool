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
  const imagePath = `out/images/${name + "-" + chapter}.png`;
  let timeout = 60 * 1000;
  const isImageExist = fs.existsSync(imagePath);

  if (isImageExist) {
    timeout = 1 * 1000;
  }

  console.log(
    `Image Path: ${imagePath} - Is Image Exist: ${isImageExist} - Timeout: ${timeout} - URL: ${url}`
  );

  const page = await newTab();

  await page.setCookie(
    {
      domain: ".metruyencv.com",
      expirationDate: 1740319981.582806,
      hostOnly: false,
      httpOnly: true,
      name: "cf_clearance",
      path: "/",
      sameSite: "None",
      secure: true,
      session: false,
      storeId: "0",
      value:
        "0eg74LEgwMrAC99.NRefc7emF_NKCCnds9q_lBkYHPs-1708783981-1.0-AZn8QUwcMJ5AQ9z9q0buRPDu02gt2M3iNqyWEVO58NtirrijVzv6zI17y+/jlfd/kK7/5EJbHjERPJTGZu9+SAs=",
      id: 1,
    },
    {
      domain: "metruyencv.com",
      expirationDate: 1709993761,
      hostOnly: true,
      httpOnly: false,
      name: "l_token",
      path: "/",
      sameSite: "Strict",
      secure: false,
      session: false,
      storeId: "0",
      value:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkudHJ1eWVuLm9ubFwvdjJcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNzA4Nzg0MTYxLCJleHAiOjE3MDkyMTYxNjEsIm5iZiI6MTcwODc4NDE2MSwianRpIjoiZTBTMUJTcTkyS3BtdlVUZSIsInN1YiI6MTQ1NzQ3NCwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.OogyXI1OV1VsSH0y1a7YfzDeBZV4S3Yb7V2iWb8iRow",
      id: 2,
    },
    {
      domain: "metruyencv.com",
      expirationDate: 1743344162.845236,
      hostOnly: true,
      httpOnly: true,
      name: "metruyenchucom_session",
      path: "/",
      sameSite: "Lax",
      secure: true,
      session: false,
      storeId: "0",
      value:
        "eyJpdiI6Ik1TTFwvMkhEUjlvVGdMOWxpXC9cL1F1ZUE9PSIsInZhbHVlIjoidzQzUWdJRGVGMWhBMUNQK2tPNGFVeVg0Y3A5c3lQME5wbU92M2JOWmxRczFFcE9RV0krRFVTU1ZNakdyXC9TYVoiLCJtYWMiOiI0ZjViYWI5YjE4MzJjOGJiODkyNzMzMzU1NTAxMWU0YTdkZDIxOTAxNTE2ZDJiNTVjMzY3OTE3NDAzMDljZjhlIn0%3D",
      id: 3,
    },
    {
      domain: "metruyencv.com",
      expirationDate: 1709993761,
      hostOnly: true,
      httpOnly: false,
      name: "r_token",
      path: "/",
      sameSite: "Strict",
      secure: false,
      session: false,
      storeId: "0",
      value:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkudHJ1eWVuLm9ubFwvdjJcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNzA4Nzg0MTYxLCJleHAiOjE3MDkyMTYxNjEsIm5iZiI6MTcwODc4NDE2MSwianRpIjoiZTBTMUJTcTkyS3BtdlVUZSIsInN1YiI6MTQ1NzQ3NCwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.OogyXI1OV1VsSH0y1a7YfzDeBZV4S3Yb7V2iWb8iRow",
      id: 4,
    }
  );

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
        await autoScroll(page);

        const title = await page.$eval(".nh-read__title", (element) => {
          return element.textContent;
        });

        // with tessaract
        if (!isImageExist) {
          const element = await page.$("#article");

          await element.screenshot({
            path: imagePath,
          });
        }
        // with tessaract
        // const data = await imageToHtml(imagePath);
        const data = "";

        // without tessaract
        // const article = await page.$eval("#article", (element) => {
        //   element.querySelectorAll("div").forEach((div) => div.remove());

        //   return element.innerHTML;
        // });
        // const data = `<div>${article}</div>`;

        resolve({
          title,
          data,
        });
      } catch (e) {
        console.log(e);
        console.log(`Error crawling ${url}`);

        resolve({
          title: `Chapter not found`,
          data: `<div></div>`,
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

  const data = await imageToHtml(imagePath);

  return {
    title,
    data,
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

        // return contentByUrl(`${baseUrl}${chapter}`, {
        //   chapter,
        //   name: "quy-bi-chi-chu",
        // });

        return tessaractWithImages("quy-bi-chi-chu", chapter, jsonIndex);
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

export { vanCoThanDe, taCoMotThanBiDongKy, quyBiChiChu };
