import { createWorker } from "tesseract.js";

let worker = undefined;

export const imageToHtml = async (path) => {
  if (worker === undefined) {
    worker = await createWorker("vie");
  }

  try {
    const {
      data: { text },
    } = await worker.recognize(path);

    return textFormat(text);
  } catch (e) {
    console.log("tesseract error", e);
    return "Tesseract error";
  }
};

export const terminateWorker = async () => {
  if (worker === undefined) {
    console.log("Worker terminated.");

    return;
  }

  await worker.terminate();

  console.log("Worker terminated.");

  return;
};

export const textFormat = (text) => {
  const br = "<br><br>";

  const content = text.replace(/\n\n/g, br).replace(/\n/g, " ");

  const newText = `<div>${content}</div>`;

  return newText;
};
