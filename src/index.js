import { closeBrowser } from "./crawler/common/browser.js";
import { generateEpub as vancothande } from "./epub-generator/vancothande.js";

async function main() {
  await vancothande();

  await closeBrowser();
}

main();
