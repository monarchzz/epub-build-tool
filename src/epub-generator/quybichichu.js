import Epub from "epub-gen";
import { quyBiChiChu } from "../crawler/metruyenchu/index.js";
import fs from "fs";

async function generateEpub() {
  const startChapter = 1359;
  const totalChapters = 1414;

  const name = `quy-bi-chi-chu-${startChapter}-${totalChapters}`;

  const quyChiChiChuData = await quyBiChiChu({
    startChapter,
    totalChapters,
    step: 100,
  });

  const json = JSON.stringify(quyChiChiChuData, null, 2);
  await fs.promises.writeFile(`out/json/${name}.json`, json);

  await new Epub(
    {
      title: "Quỷ Bí Chi Chủ",
      author: "Ái Tiềm Thủy Đích Ô Tặc",
      publisher: "KOL",
      cover: "https://static.cdnno.com/poster/quy-bi-chi-chu/300.jpg",
      content: quyChiChiChuData,
    },
    `out/${name}.epub`
  ).promise;
}

export { generateEpub };
