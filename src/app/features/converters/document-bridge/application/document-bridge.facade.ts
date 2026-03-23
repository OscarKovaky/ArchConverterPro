import { Injectable } from '@angular/core';
import { ConversionDirection } from '../domain/conversion-direction.type';
import { ConversionResult } from '../domain/conversion-result.model';
import { PdfExportService } from '../infrastructure/word-to-pdf/pdf-export.service';
import { WordRenderService } from '../infrastructure/word-to-pdf/word-render.service';
import { PdfReaderService } from '../infrastructure/pdf-to-word/pdf-reader.service';
import { PdfTextExtractorService } from '../infrastructure/pdf-to-word/pdf-text-extractor.service';
import { WordBuilderService } from '../infrastructure/pdf-to-word/word-builder.service';
import { FidelityWarningService } from '../infrastructure/shared/fidelity-warning.service';
import { HistoryService } from '../infrastructure/shared/history.service';

@Injectable({ providedIn: 'root' })
export class DocumentBridgeFacade {
  constructor(
    private readonly wordRenderService: WordRenderService,
    private readonly pdfExportService: PdfExportService,
    private readonly pdfReaderService: PdfReaderService,
    private readonly pdfTextExtractorService: PdfTextExtractorService,
    private readonly wordBuilderService: WordBuilderService,
    private readonly fidelityWarningService: FidelityWarningService,
    private readonly historyService: HistoryService
  ) {}

  async renderWordPreview(file: File, container: HTMLElement): Promise<void> {
    await this.wordRenderService.render(file, container);
  }

  async convertWordToPdf(file: File, source: HTMLElement): Promise<ConversionResult> {
    const outputFileName = file.name.replace(/\.docx$/i, '.pdf');
    const blob = await this.pdfExportService.exportPreview(source, outputFileName);

    return this.finalizeResult({
      direction: 'word-to-pdf',
      inputFile: file,
      outputFileName,
      blob,
      summary: 'DOCX renderizado a HTML y exportado a PDF con prioridad visual.'
    });
  }

  async convertPdfToWord(file: File): Promise<ConversionResult> {
    const pdf = await this.pdfReaderService.read(file);
    const title = file.name.replace(/\.pdf$/i, '');
    const model = await this.pdfTextExtractorService.extract(pdf, title);
    const blob = await this.wordBuilderService.buildDocx(model);
    const outputFileName = `${title}.docx`;
    const summary = `PDF procesado (${model.pages.length} páginas), texto extraído y reconstruido en Word editable.`;

    return this.finalizeResult({
      direction: 'pdf-to-word',
      inputFile: file,
      outputFileName,
      blob,
      summary
    });
  }

  getHistory() {
    return this.historyService.getAll();
  }

  download(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  private finalizeResult(input: {
    direction: ConversionDirection;
    inputFile: File;
    outputFileName: string;
    blob: Blob;
    summary: string;
  }): ConversionResult {
    const fidelity = this.fidelityWarningService.getFidelity(input.direction);
    const warnings = this.fidelityWarningService.buildWarnings(input.direction);

    this.historyService.add({
      id: crypto.randomUUID?.() ?? `${Date.now()}`,
      createdAt: new Date().toISOString(),
      inputFileName: input.inputFile.name,
      outputFileName: input.outputFileName,
      direction: input.direction,
      fidelity,
      status: 'success',
      summary: input.summary
    });

    return {
      direction: input.direction,
      outputFileName: input.outputFileName,
      blob: input.blob,
      summary: input.summary,
      fidelity,
      warnings
    };
  }
}
