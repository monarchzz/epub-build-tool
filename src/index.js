import { closeBrowser } from "./crawler/common/browser.js";
import { terminateWorker } from "./crawler/common/tesseract.js";
// import { generateEpub } from "./epub-generator/tathatkhongmuontrongsinha.js";
// import { generateEpub } from "./epub-generator/vancothande.js";
// import { generateEpub } from "./epub-generator/tacomotthanbidongky.js";
import { generateEpub } from "./epub-generator/tien-tu-xin-nghe-ta-giai-thich.js";

async function main() {
  await generateEpub();
  await terminateWorker();
  await closeBrowser();
}

main();
