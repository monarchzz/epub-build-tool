import { launch } from "puppeteer";

const browser = await launch({ headless: "new" });

const newTab = () => {
  return browser.newPage();
};

const closeBrowser = () => {
  console.log("Browser closed.");
  return browser.close();
};

export { newTab, closeBrowser };
