import { newTab } from "../common/browser.js";

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

async function contentByUrl(url) {
  const page = await newTab();

  await page.setCookie(
    {
      domain: ".metruyencv.com",
      expirationDate: 1740239698.080674,
      hostOnly: false,
      httpOnly: true,
      name: "cf_clearance",
      path: "/",
      sameSite: "None",
      secure: true,
      session: false,
      storeId: "0",
      value:
        "1tmOh9qJhnFTCEeiqhfIqds5DktthEEYYuphLed_2u0-1708703698-1.0-AWm2w8xeCq9WM+YgfjuO6eCcvMAS01o8wvKsUY1iAvTGnxR2sYh4lyq3bM3Dlj2HvY9ApJFryFL34C+hZ2Uhxus=",
      id: 1,
    },
    {
      domain: "metruyencv.com",
      expirationDate: 1709913304,
      hostOnly: true,
      httpOnly: false,
      name: "l_token",
      path: "/",
      sameSite: "strict",
      secure: false,
      session: false,
      storeId: "0",
      value:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkudHJ1eWVuLm9ubFwvdjJcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNzA4NzAzNzA0LCJleHAiOjE3MDkxMzU3MDQsIm5iZiI6MTcwODcwMzcwNCwianRpIjoiVFNNeWVtbzg0dFVWU3M3cSIsInN1YiI6MTAyODA5NiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.QicZdO0C0aeebgfi6eY9eknjC9Or0AF3qhYzhEJ-jVg",
      id: 2,
    },
    {
      domain: "metruyencv.com",
      expirationDate: 1743263976.290177,
      hostOnly: true,
      httpOnly: true,
      name: "metruyenchucom_session",
      path: "/",
      sameSite: "Lax",
      secure: true,
      session: false,
      storeId: "0",
      value:
        "eyJpdiI6ImE3WUpQODhiOGMwYkhjdzV5Ynh6XC93PT0iLCJ2YWx1ZSI6ImllaE9yYVZRYWhwV1g2aU1Wb1VSdE9PVDRyQ1FSd1ZqeWFcL2hZcmdPVFwvc0V2dkFpWm54eTFRellyakhJd3pMYyIsIm1hYyI6IjE0NTcxZGFkOTk3Yjc1ZTdmMzQxZDU4NjY0ZThiMTljZmU0MjcxMDg3YTdjNjAwYzIzOGE5NGFlYzkyZDI0Y2QifQ%3D%3D",
      id: 3,
    },
    {
      domain: "metruyencv.com",
      expirationDate: 1709913304,
      hostOnly: true,
      httpOnly: false,
      name: "r_token",
      path: "/",
      sameSite: "Strict",
      secure: false,
      session: false,
      storeId: "0",
      value:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkudHJ1eWVuLm9ubFwvdjJcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNzA4NzAzNzA0LCJleHAiOjE3MDkxMzU3MDQsIm5iZiI6MTcwODcwMzcwNCwianRpIjoiVFNNeWVtbzg0dFVWU3M3cSIsInN1YiI6MTAyODA5NiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.QicZdO0C0aeebgfi6eY9eknjC9Or0AF3qhYzhEJ-jVg",
      id: 4,
    }
  );

  await page.setViewport({
    width: 1200,
    height: 10000,
  });

  await page.goto(url);

  return await new Promise((resolve) => {
    setTimeout(async () => {
      try {
        await autoScroll(page);
        const x = await page.$eval("#article", (element) => {
          return element.innerHTML;
        });

        console.log(x);

        const article = await page.$eval("#article", (element) => {
          element.querySelectorAll("div").forEach((div) => div.remove());

          return element.innerHTML;
        });

        const title = await page.$eval(".nh-read__title", (element) => {
          return element.textContent;
        });

        resolve({
          title,
          data: `<div>${article}</div>`,
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
    }, 1 * 1000);
  });
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
  const totalChapters = 1365;
  const baseUrl = "https://metruyencv.com/truyen/quy-bi-chi-chu/chuong-";

  const data = await batchCrawl({
    baseUrl,
    totalChapters,
    step: 10,
    startChapter: 1365,
  });

  return data;
}

export { vanCoThanDe, taCoMotThanBiDongKy, quyBiChiChu };
