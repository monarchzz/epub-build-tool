import { newTab } from "../common/browser.js";
import fs from "fs";

async function contentByUrl(url, { chapter, basePath }) {
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  const imagesPath = `${basePath}/images`;
  const contentsPath = `${basePath}/contents`;
  if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath, { recursive: true });
  }
  if (!fs.existsSync(contentsPath)) {
    fs.mkdirSync(contentsPath, { recursive: true });
  }

  const imagePath = `${imagesPath}/${chapter}.png`;
  const contentPath = `${contentsPath}/${chapter}.json`;
  let timeout = 1 * 1000;

  const isImageExist = fs.existsSync(imagePath);
  const isContentExist = fs.existsSync(contentPath);

  console.log(
    `Image Path: ${imagePath} - Is Image Exist: ${isImageExist} - Is Content Exist: ${isContentExist} - Timeout: ${timeout}`
  );

  if (isContentExist) {
    // const localContent = JSON.parse(
    //   await fs.promises.readFile(contentPath, "utf8")
    // );

    return;
  } else {
    const page = await newTab();

    await page.setViewport({
      width: 1200,
      height: 100000,
    });

    await page.goto(url, {
      waitUntil: "networkidle2",
    });

    await new Promise((resolve) => {
      setTimeout(async () => {
        let hasError = false;
        let content = "";
        let title = `Chapter ${chapter}`;

        const chapterElement = await page.$(`.reading-content .text-left`);
        await page.evaluate((element) => {
          const divElements = element.querySelectorAll("div");
          divElements.forEach((div) => div.remove());
        }, chapterElement);

        try {
          // eval first p tag
          title = await page.evaluate((element) => {
            const pElement = element.querySelector("p");
            return pElement ? pElement.textContent : null;
          }, chapterElement);
        } catch (e) {
          hasError = true;
          console.log(`Error getting title for chapter ${chapter}`);
          console.log(e);
        }

        try {
          // screenshot
          if (!isImageExist) {
            await chapterElement.screenshot({
              path: imagePath,
            });
          }
        } catch (e) {
          hasError = true;
          console.log(`Error taking screenshot for chapter ${chapter}`);
          console.log(e);
        }

        try {
          // without tessaract
          const article = await page.evaluate(
            (element) => element.innerHTML,
            chapterElement
          );
          content = `<div>${article}</div>`;
        } catch (e) {
          hasError = true;
          console.log(e);
          console.log(`Error crawling ${url}`);
        } finally {
          await page.close();
        }

        if (hasError) {
          console.log(`Error crawling ${url}`);
          resolve({
            id: chapter,
            title: `Chapter not found`,
            content: `<div></div>`,
          });
        } else {
          const result = {
            id: chapter,
            title,
            content,
          };

          // save content to file
          await fs.promises.writeFile(
            contentPath,
            JSON.stringify(result, null, 2),
            "utf8"
          );

          resolve(result);
        }
      }, timeout);
    });
  }
}

async function getContent({
  baseUrl,
  totalChapters,
  startChapter = 1,
  step = 10,
  basePath,
}) {
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
        });
      })
    );
  }

  const data = [];
  for (let chapter = startChapter; chapter <= totalChapters; chapter++) {
    const contentPath = `${basePath}/contents/${chapter}.json`;
    const isContentExist = fs.existsSync(contentPath);

    if (!isContentExist) {
      data.push({
        id: chapter,
        title: `Chapter ${chapter}`,
        content: `<div>No content</div>`,
      });
      continue;
    }

    let content = JSON.parse(await fs.promises.readFile(contentPath, "utf8"));

    if (content.title.includes("\n")) {
      const newTitle = content.title.split("\n")[0];

      content = { ...content, title: newTitle };

      // save content to file
      await fs.promises.writeFile(
        contentPath,
        JSON.stringify(content, null, 2),
        "utf8"
      );
    }

    data.push(content);
  }

  //   sort data by id
  data.sort((a, b) => a.id - b.id);

  return data;
}

export { getContent };
