import * as pdfjs from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth/mammoth.browser';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_FILE_BYTES = 12 * 1024 * 1024;

/** Extracts selectable text locally from a user-provided PDF or DOCX file. */
export async function extractOfficialLetter(file) {
  if (!file) throw new Error('Choose a PDF or DOCX file first.');
  if (file.size > MAX_FILE_BYTES) throw new Error('Please upload a file smaller than 12 MB.');
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'pdf') return readPdf(file);
  if (extension === 'docx') return readDocx(file);
  throw new Error('Unsupported file. Please upload a PDF or DOCX document.');
}

async function readPdf(file) {
  const document = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    let text = ''; let previousY;
    content.items.forEach(item => {
      const y = item.transform?.[5];
      if (previousY !== undefined && Math.abs(y - previousY) > 4) text += '\n';
      text += item.str + (item.hasEOL ? '\n' : ' '); previousY = y;
    });
    pages.push(text.trim());
  }
  const text = pages.filter(Boolean).join('\n\n');
  if (!text) throw new Error('No selectable text was found in this PDF. Scanned PDFs need OCR before upload.');
  return text;
}

async function readDocx(file) {
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  const text = result.value.trim();
  if (!text) throw new Error('No text was found in this Word document.');
  return text;
}

