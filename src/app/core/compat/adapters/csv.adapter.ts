import { FileAdapter, ParseContext } from '../interfaces/file-adapter.interface';
import { NormalizedDocument } from '../models/normalized-document.model';
import { parseCsvRows } from '../services/csv.util';

export class CsvAdapter implements FileAdapter {
  readonly format = 'csv' as const;

  async parse(file: File, context: ParseContext): Promise<NormalizedDocument> {
    const content = await file.text();
    const rows = parseCsvRows(content);

    return {
      format: this.format,
      sourceName: file.name,
      mimeType: file.type,
      size: file.size,
      textContent: content,
      tables: [{ name: file.name, rows }],
      metadata: {
        detectedBy: context.detectedBy,
        parsedAt: new Date().toISOString(),
        bestEffort: context.bestEffort
      },
      warnings: context.warnings
    };
  }
}
