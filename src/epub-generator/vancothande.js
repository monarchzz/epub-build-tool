import Epub from "epub-gen";
import { vanCoThanDe } from "../crawler/metruyenchu/index.js";

async function generateEpub() {
  const vanCoThanDeData = await vanCoThanDe();
  await new Epub(
    {
      title: "Vạn Cổ Thần Đế",
      author: "Phi Thiên Ngư",
      publisher: "DarkHero",
      cover: "https://static.cdnno.com/poster/van-co-than-de/300.jpg",
      content: vanCoThanDeData,
    },
    "van-co-than-de.epub"
  ).promise;
}

export { generateEpub };
