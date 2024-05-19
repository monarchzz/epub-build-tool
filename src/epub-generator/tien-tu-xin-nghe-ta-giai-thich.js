import Epub from "epub-gen";
import fs from "fs";
import { tientuxinnghetagiaithich } from "../crawler/metruyenchu/index.js";

async function generateEpub() {
  const basePath = "out/tien-tu-xin-nghe-ta-giai-thich";

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  const startChapter = 1;
  const totalChapters = 608;

  const name = `tien-tu-xin-nghe-ta-giai-thich-${startChapter}-${totalChapters}`;

  const content = await tientuxinnghetagiaithich({
    startChapter,
    totalChapters,
    step: 30,
    basePath,
  });

  const json = JSON.stringify(content, null, 2);
  await fs.promises.writeFile(`${basePath}/${name}.json`, json);

  await new Epub(
    {
      title: "Tiên Tử, Xin Nghe Ta Giải Thích",
      author: "Di Thiên Đại Hạ",
      publisher: "Nguyễn Như Ý",
      cover:
        "https://static.cdnno.com/poster/tien-tu-xin-nghe-ta-giai-thich/600.jpg",
      content: content.map((item) => ({
        title: item.title,
        data: item.content,
      })),
    },
    `${basePath}/${name}.epub`
  ).promise;
}

export { generateEpub };
