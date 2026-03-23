import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

(pdfjsLib as typeof pdfjsLib & { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc =
  new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

@Injectable({ providedIn: 'root' })
export class PdfReaderService {
  async read(file: File): Promise<PDFDocumentProxy> {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const task = pdfjsLib.getDocument({ data: bytes });
    return task.promise;
  }
}
