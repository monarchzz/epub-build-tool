import { launch } from "puppeteer";

const browser = await launch({ headless: "new" });

const newTab = () => {
  return browser.newPage();
};

const closeBrowser = () => {
  return browser.close();
};

export { newTab, closeBrowser };
