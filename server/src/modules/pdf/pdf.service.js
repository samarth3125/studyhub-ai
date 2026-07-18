import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractPDFText = async (buffer) => {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
  const pdf = await loadingTask.promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    text +=
      content.items.map((item) => item.str).join(" ") + "\n";
  }

  return text;
};