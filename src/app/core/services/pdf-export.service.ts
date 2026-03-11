import { Injectable } from '@angular/core';
import html2pdf from 'html2pdf.js';
import { ExportOptions } from '../models/export-options.model';

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  async exportElementToPdfBlob(source: HTMLElement, options: ExportOptions): Promise<Blob> {
    return html2pdf()
      .set({
        margin: options.margin,
        filename: options.fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: options.format, orientation: options.orientation }
      })
      .from(source)
      .outputPdf('blob');
  }
}
