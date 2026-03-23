import { PDFDocument } from 'pdf-lib';
import { FileAdapter, ParseContext } from '../interfaces/file-adapter.interface';
import { NormalizedDocument } from '../models/normalized-document.model';

export class PdfAdapter implements FileAdapter {
  readonly format = 'pdf' as const;

  async parse(file: File, context: ParseContext): Promise<NormalizedDocument> {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const pageCount = pdf.getPageCount();

    return {
      format: this.format,
      sourceName: file.name,
      mimeType: file.type,
      size: file.size,
      pages: Array.from({ length: pageCount }, (_, index) => ({ index })),
      metadata: {
        detectedBy: context.detectedBy,
        parsedAt: new Date().toISOString(),
        bestEffort: context.bestEffort
      },
      warnings: context.warnings
    };
  }
}
