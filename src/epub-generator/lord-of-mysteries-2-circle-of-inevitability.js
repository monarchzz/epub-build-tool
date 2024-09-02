import Epub from "epub-gen";
import fs from "fs";
import { getContent } from "../crawler/boxnovel/index.js";

async function generateEpub() {
  const basePath = "out/circle-of-inevitability";

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  const startChapter = 1;
  const totalChapters = 947;

  const name = `circle-of-inevitability-${startChapter}-${totalChapters}`;

  const contents = await getContent({
    startChapter,
    totalChapters,
    step: 5,
    basePath,
    baseUrl:
      "https://boxnovel.com/novel/lord-of-mysteries-2-circle-of-inevitability/chapter-",
  });

  const json = JSON.stringify(contents, null, 2);
  await fs.promises.writeFile(`${basePath}/${name}.json`, json);

  // const contents = JSON.parse(
  //   await fs.promises.readFile(`${basePath}/${name}.json`)
  // );

  await new Epub(
    {
      title: "Lord of Mysteries 2: Circle of Inevitability",
      author: "Cuttlefish That Loves Diving",
      publisher: "boxnovel",
      cover:
        "https://boxnovel.com/wp-content/uploads/2023/03/lord-of-mysteries-2-circle-of-inevitability.jpg",
      content: contents.map((item) => ({
        title: item.title,
        data: item.content,
      })),
    },
    `${basePath}/${name}.epub`
  ).promise;
}

export { generateEpub };
