import pdf from 'pdf-parse';
import fs from 'fs';
import ApiError from 'ApiError.js';
class PdfParese {
  async pdfParseText(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    try {
      const data = await pdf(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new ApiError('Failed to parse PDF', 500);
    }
  }
  async getAllPagesRawContent(filePath) {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    const allPages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      allPages.push({
        page: i,
        content: content,
      });
    }

    return allPages;
  }
}

export default PdfParese;
