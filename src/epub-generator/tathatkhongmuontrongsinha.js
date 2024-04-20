import Epub from "epub-gen";
import fs from "fs";
import { tathatkhongmuontrongsinha } from "../crawler/metruyenchu/index.js";

async function generateEpub() {
  const basePath = "out/ta-that-khong-muon-trong-sinh-a";

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  const startChapter = 500;
  const totalChapters = 1000;

  const name = `ta-that-khong-muon-trong-sinh-a-${startChapter}-${totalChapters}`;

  const content = await tathatkhongmuontrongsinha({
    startChapter,
    totalChapters,
    step: 30,
  });

  const json = JSON.stringify(content, null, 2);
  await fs.promises.writeFile(`${basePath}/${name}.json`, json);

  await new Epub(
    {
      title: "Ta Thật Không Muốn Trọng Sinh A",
      author: "Liễu Ngạn Hoa Hựu Minh   ",
      publisher: "HacTamX",
      cover:
        "https://static.cdnno.com/poster/ta-that-khong-muon-trong-sinh-a/300.jpg?1585206344",
      content: content.map((item) => ({
        title: item.title,
        data: item.content,
      })),
    },
    `${basePath}/${name}.epub`
  ).promise;
}

export { generateEpub };
