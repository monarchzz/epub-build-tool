import { closeBrowser } from "./crawler/common/browser.js";
import { generateEpub } from "./epub-generator/tucmenhchihoan.js";
import { terminateWorker } from "./crawler/common/tesseract.js";
// import { generateEpub } from "./epub-generator/vancothande.js";
// import { generateEpub } from "./epub-generator/tacomotthanbidongky.js";

async function main() {
  await generateEpub();
  await terminateWorker();
  await closeBrowser();
}

main();
