import Epub from "epub-gen";
import { taCoMotThanBiDongKy } from "../crawler/metruyenchu/index.js";
import fs from "fs";

async function generateEpub() {
  const data = await taCoMotThanBiDongKy();

  await new Epub(
    {
      title: "Ta Có Một Thân Bị Động Kỹ",
      author: "Ngao Dạ Cật Bình Quả",
      cover:
        "https://static.cdnno.com/poster/ta-co-mot-than-bi-dong-ky/300.jpg",
      content: data,
    },
    "out/ta-co-mot-than-bi-dong-ky.epub"
  ).promise;
}

export { generateEpub };
