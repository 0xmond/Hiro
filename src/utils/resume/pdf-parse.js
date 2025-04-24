// import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

// export async function extractTextFromPDFUrl(pdfUrl) {
//   const response = await axios.get(pdfUrl, {
//     responseType: "arraybuffer",
//   });

//   const pdfBuffer = Buffer.from(response.data);
//   const loadingTask = getDocument({ data: pdfBuffer });
//   const pdf = await loadingTask.promise;
//   let text = "";

//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i);
//     const content = await page.getTextContent();
//     const pageText = content.items.map((item) => item.str).join(" ");
//     text += pageText + "\n";
//   }

//   return text;
// }

// async function extractTextWithPdf2json(pdfPath) {
//   const pdfParser = new PDFParser();

//   return new Promise((resolve, reject) => {
//     pdfParser.on('pdfParser_dataError', err => reject(err.parserError));
//     pdfParser.on('pdfParser_dataReady', pdfData => {
//       const text = pdfData.formImage.Pages.map(page =>
//         page.Texts.map(textItem =>
//           decodeURIComponent(textItem.R[0].T)
//         ).join(' ')
//       ).join('\n\n');
//       resolve(text);
//     });

//     pdfParser.loadPDF(pdfPath);
//   });
// }
