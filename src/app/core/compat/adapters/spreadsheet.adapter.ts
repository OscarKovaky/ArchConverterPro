import * as XLSX from 'xlsx';
import { FileAdapter, ParseContext } from '../interfaces/file-adapter.interface';
import { NormalizedDocument } from '../models/normalized-document.model';

export class SpreadsheetAdapter implements FileAdapter {
  constructor(public readonly format: 'xlsx' | 'xls') {}

  async parse(file: File, context: ParseContext): Promise<NormalizedDocument> {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });

    const tables = workbook.SheetNames.map((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
        header: 1,
        raw: false
      }).map((row) => row.map((cell) => (cell == null ? '' : String(cell))));

      return { name: sheetName, rows };
    });

    return {
      format: this.format,
      sourceName: file.name,
      mimeType: file.type,
      size: file.size,
      tables,
      metadata: {
        detectedBy: context.detectedBy,
        parsedAt: new Date().toISOString(),
        bestEffort: context.bestEffort
      },
      warnings: context.warnings
    };
  }
}
