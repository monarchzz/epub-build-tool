import { closeBrowser } from "./crawler/common/browser.js";
import { generateEpub } from "./epub-generator/tacomotthanbidongky.js";

async function main() {
  await generateEpub();
  await closeBrowser();
}

main();
