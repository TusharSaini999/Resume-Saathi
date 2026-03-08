import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import ApiError from './ApiError.js';
class PdfParese {
  async getText(filePath) {
    try {
      const data = new Uint8Array(fs.readFileSync(filePath));
      const pdf = await pdfjsLib.getDocument({ data }).promise;

      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        let lastY = null;
        let line = '';

        for (const item of content.items) {
          const y = item.transform[5];

          if (lastY !== null && Math.abs(y - lastY) > 5) {
            text += line + '\n';
            line = '';
          }

          line += item.str + ' ';
          lastY = y;
        }

        text += line + '\n\n';
      }

      return text.trim();
    } catch (error) {
      throw new ApiError(500, 'Failed to parse PDF: ' + error.message);
    }
  }
  async getAllPagesRawContent(filePath) {
    try {
      const data = new Uint8Array(fs.readFileSync(filePath));
      const pdf = await pdfjsLib.getDocument({ data }).promise;

      const allPages = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const itemsWithPositions = content.items.map((item) => ({
          text: item.str,
          x: item.transform[4], // x coordinate
          y: item.transform[5], // y coordinate
          fontHeight: item.height,
          width: item.width,
        }));

        allPages.push({
          page: i,
          items: itemsWithPositions,
        });
      }
      return allPages;
    } catch (error) {
      console.error('Error in getAllPagesWithPositions:', error);
      throw new ApiError(500, 'Failed to extract PDF content: ' + error.message);
    }
  }
}

export default PdfParese;
