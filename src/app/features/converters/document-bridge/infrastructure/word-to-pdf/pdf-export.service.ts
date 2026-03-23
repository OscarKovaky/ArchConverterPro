import { Injectable } from '@angular/core';
import html2pdf from 'html2pdf.js';

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  async exportPreview(source: HTMLElement, outputFileName: string): Promise<Blob> {
    return html2pdf()
      .set({
        margin: 0.4,
        filename: outputFileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      })
      .from(source)
      .outputPdf('blob');
  }
}
