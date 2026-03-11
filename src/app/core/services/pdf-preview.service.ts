import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable({ providedIn: 'root' })
export class PdfPreviewService {
  async renderFirstPage(pdfBlob: Blob, canvas: HTMLCanvasElement): Promise<void> {
    const data = await pdfBlob.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data }).promise;
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: 1.2 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const context = canvas.getContext('2d');
    if (!context) return;
    await page.render({ canvasContext: context, viewport }).promise;
  }
}
