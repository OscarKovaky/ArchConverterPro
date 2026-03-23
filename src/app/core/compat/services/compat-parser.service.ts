import { Injectable } from '@angular/core';
import { CsvAdapter } from '../adapters/csv.adapter';
import { DocxAdapter } from '../adapters/docx.adapter';
import { ImageAdapter } from '../adapters/image.adapter';
import { LegacyTextAdapter } from '../adapters/legacy-text.adapter';
import { PdfAdapter } from '../adapters/pdf.adapter';
import { SpreadsheetAdapter } from '../adapters/spreadsheet.adapter';
import { FileFormatDetector } from '../detector/file-format-detector';
import { ParseError } from '../errors/compat.errors';
import { NormalizedDocument } from '../models/normalized-document.model';
import { FileAdapterRegistry } from '../registry/file-adapter.registry';

@Injectable({ providedIn: 'root' })
export class CompatParserService {
  private readonly detector = new FileFormatDetector();

  constructor(private readonly registry: FileAdapterRegistry) {
    this.registry.registerMany([
      new DocxAdapter(),
      new SpreadsheetAdapter('xlsx'),
      new SpreadsheetAdapter('xls'),
      new CsvAdapter(),
      new ImageAdapter(),
      new PdfAdapter(),
      new LegacyTextAdapter('doc'),
      new LegacyTextAdapter('rtf')
    ]);
  }

  async parseFile(file: File): Promise<NormalizedDocument> {
    const detection = this.detector.detect(file);
    const adapter = this.registry.resolve(detection.format);

    try {
      return await adapter.parse(file, {
        detectedBy: detection.detectedBy,
        warnings: [...detection.warnings],
        bestEffort: detection.bestEffort
      });
    } catch (error) {
      if (error instanceof Error && error.name.endsWith('Error') && 'code' in (error as object)) {
        throw error;
      }
      throw new ParseError(file.name, error);
    }
  }
}
