import Epub from "epub-gen";
import { quyBiChiChu } from "../crawler/metruyenchu/index.js";

async function generateEpub() {
  const quyChiChiChuData = await quyBiChiChu();
  await new Epub(
    {
      title: "Quỷ Bí Chi Chủ",
      author: "Ái Tiềm Thủy Đích Ô Tặc",
      publisher: "KOL",
      cover:
        "https://static.cdnno.com/poster/quy-bi-chi-chu/300.jpg?1585206121",
      content: quyChiChiChuData,
    },
    "out/quy-bi-chi-chu.epub"
  ).promise;
}

export { generateEpub };
