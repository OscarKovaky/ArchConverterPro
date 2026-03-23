import { renderAsync } from 'docx-preview';
import { FileAdapter, ParseContext } from '../interfaces/file-adapter.interface';
import { NormalizedDocument } from '../models/normalized-document.model';
import { createFallbackParserWarning } from '../warnings/compatibility-warning.util';

export class DocxAdapter implements FileAdapter {
  readonly format = 'docx' as const;

  async parse(file: File, context: ParseContext): Promise<NormalizedDocument> {
    const container = document.createElement('div');
    const buffer = await file.arrayBuffer();

    try {
      await renderAsync(buffer, container);
    } catch {
      context.warnings.push(createFallbackParserWarning('docx-preview falló; se devolvió texto plano vacío'));
    }

    return {
      format: this.format,
      sourceName: file.name,
      mimeType: file.type,
      size: file.size,
      textContent: container.textContent?.trim() ?? '',
      metadata: {
        detectedBy: context.detectedBy,
        parsedAt: new Date().toISOString(),
        bestEffort: context.bestEffort
      },
      warnings: context.warnings
    };
  }
}
