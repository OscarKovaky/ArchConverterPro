import { Injectable } from '@angular/core';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { NormalizedDocumentModel } from '../../domain/normalized-document.model';

@Injectable({ providedIn: 'root' })
export class PdfTextExtractorService {
  async extract(document: PDFDocumentProxy, title: string): Promise<NormalizedDocumentModel> {
    const pages: NormalizedDocumentModel['pages'] = [];

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      pages.push({ pageNumber, text });
    }

    return { title, pages };
  }
}
