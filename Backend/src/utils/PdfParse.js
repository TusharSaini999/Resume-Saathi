import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';
import ApiError from './ApiError.js';

class DocumentParser {
  isDocxFile(filePath) {
    const ext = path.extname(filePath || '').toLowerCase();
    if (ext === '.docx' || ext === '.doc') {
      return true;
    }
    // Fallback: check zip header magic bytes PK\x03\x04
    try {
      if (fs.existsSync(filePath)) {
        const fd = fs.openSync(filePath, 'r');
        const buf = Buffer.alloc(4);
        fs.readSync(fd, buf, 0, 4, 0);
        fs.closeSync(fd);
        return buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04;
      }
    } catch {
      return false;
    }
    return false;
  }

  async getText(filePath) {
    if (this.isDocxFile(filePath)) {
      return await this.getDocxText(filePath);
    }
    return await this.getPdfText(filePath);
  }

  async getDocxText(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      const text = result?.value?.trim() || '';
      if (!text) {
        throw new Error('Extracted text from Word document is empty');
      }
      return text;
    } catch (error) {
      console.error('Error in getDocxText:', error);
      throw new ApiError(500, 'Failed to parse Word document (.docx): ' + error.message);
    }
  }

  async getPdfText(filePath) {
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
      console.error('Error in getPdfText:', error);
      throw new ApiError(500, 'Failed to parse PDF document: ' + error.message);
    }
  }

  async getAllPagesRawContent(filePath) {
    if (this.isDocxFile(filePath)) {
      return await this.getDocxRawContent(filePath);
    }
    return await this.getPdfAllPagesRawContent(filePath);
  }

  async getDocxRawContent(filePath) {
    try {
      const text = await this.getDocxText(filePath);
      const lines = text
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      const pageSize = 40;
      const allPages = [];

      for (let i = 0; i < lines.length; i += pageSize) {
        const pageLines = lines.slice(i, i + pageSize);
        const itemsWithPositions = pageLines.map((line, idx) => ({
          text: line,
          x: 50,
          y: Math.max(50, 800 - idx * 18),
          fontHeight: 11,
          width: Math.min(Math.max(line.length * 6, 40), 550),
        }));

        if (itemsWithPositions.length > 0) {
          allPages.push({
            page: Math.floor(i / pageSize) + 1,
            items: itemsWithPositions,
          });
        }
      }

      if (allPages.length === 0) {
        allPages.push({
          page: 1,
          items: [
            {
              text: text.slice(0, 200),
              x: 50,
              y: 750,
              fontHeight: 12,
              width: 200,
            },
          ],
        });
      }

      return allPages;
    } catch (error) {
      console.error('Error in getDocxRawContent:', error);
      throw new ApiError(500, 'Failed to extract Word document content: ' + error.message);
    }
  }

  async getPdfAllPagesRawContent(filePath) {
    try {
      const data = new Uint8Array(fs.readFileSync(filePath));
      const pdf = await pdfjsLib.getDocument({ data }).promise;

      const allPages = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const itemsWithPositions = content.items
          .map((item) => ({
            text: item.str.trim(),
            x: item.transform[4],
            y: item.transform[5],
            fontHeight: item.height || 0,
            width: item.width || 0,
          }))
          .filter(
            (item) =>
              item.text &&
              item.text.length > 0 &&
              item.width > 0 &&
              item.fontHeight > 0
          );

        if (itemsWithPositions.length > 0) {
          allPages.push({
            page: i,
            items: itemsWithPositions,
          });
        }
      }

      return allPages;
    } catch (error) {
      console.error('Error in getAllPagesRawContent:', error);
      throw new ApiError(500, 'Failed to extract PDF content: ' + error.message);
    }
  }
}

const PdfParse = DocumentParser;
export { DocumentParser };
export default PdfParse;
