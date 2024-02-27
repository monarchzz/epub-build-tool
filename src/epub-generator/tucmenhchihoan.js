import Epub from "epub-gen";
import fs from "fs";
import { tucMenhChiHoan } from "../crawler/metruyenchu/index.js";

async function generateEpub() {
  const basePath = "out/tuc-menh-chi-hoan";

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  const startChapter = 1;
  const totalChapters = 500;

  const name = `tuc-menh-chi-hoan-${startChapter}-${totalChapters}`;

  const content = await tucMenhChiHoan({
    startChapter,
    totalChapters,
    step: 10,
  });

  const json = JSON.stringify(content, null, 2);
  await fs.promises.writeFile(`${basePath}/${name}.json`, json);

  await new Epub(
    {
      title: "Túc Mệnh Chi Hoàn",
      author: "Ái Tiềm Thủy Đích Ô Tặc",
      publisher: "KOL",
      cover:
        "https://static.cdnno.com/poster/tuc-menh-chi-hoan/300.jpg?1677230435",
      content: content.map((item) => ({
        title: item.title,
        data: item.content,
      })),
    },
    `${basePath}/${name}.epub`
  ).promise;
}

export { generateEpub };
