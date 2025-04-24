import axios from "axios";
import fs from "fs/promises";
import path from "path";
import pkg from "pdf2json";
const PDFParser = pkg;

export async function extractTextFromPdf(pdfUrl) {
  const tempPath = path.resolve("resume_downloaded.pdf");

  const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });

  await fs.writeFile(tempPath, response.data);

  const pdfParser = new PDFParser();

  return new Promise(async (resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (err) => reject(err.parserError));

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const text = pdfData.Pages.map((page) =>
        page.Texts.map((textItem) => decodeURIComponent(textItem.R[0].T)).join(
          " "
        )
      ).join("\n\n");
      resolve(text);
    });

    pdfParser.loadPDF(tempPath);
    await fs.unlink(tempPath);
  });
}
