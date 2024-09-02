import { closeBrowser } from "./crawler/common/browser.js";
import { terminateWorker } from "./crawler/common/tesseract.js";
import { generateEpub } from "./epub-generator/lord-of-mysteries-2-circle-of-inevitability.js";

async function main() {
  await generateEpub();
  await terminateWorker();
  await closeBrowser();
}

main();
