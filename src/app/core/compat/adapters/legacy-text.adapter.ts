import { FileAdapter, ParseContext } from '../interfaces/file-adapter.interface';
import { NormalizedDocument } from '../models/normalized-document.model';
import { sanitizeLooseText } from '../services/file-reader.util';
import { createFallbackParserWarning } from '../warnings/compatibility-warning.util';

const decodeBestEffort = (buffer: ArrayBuffer): string => {
  const decoders: string[] = ['utf-8', 'windows-1252', 'iso-8859-1'];

  for (const encoding of decoders) {
    try {
      const text = new TextDecoder(encoding, { fatal: false }).decode(buffer);
      if (text.trim().length > 0) return text;
    } catch {
      // Best effort: probar siguiente encoding.
    }
  }

  return '';
};

const stripRtfSyntax = (rtf: string): string =>
  rtf
    .replace(/\\par[d]?/g, '\n')
    .replace(/\\'[0-9a-fA-F]{2}/g, '')
    .replace(/\\[a-z]+\d* ?/g, '')
    .replace(/[{}]/g, '');

export class LegacyTextAdapter implements FileAdapter {
  constructor(public readonly format: 'doc' | 'rtf') {}

  async parse(file: File, context: ParseContext): Promise<NormalizedDocument> {
    const buffer = await file.arrayBuffer();
    const rawText = decodeBestEffort(buffer);
    const textContent = this.format === 'rtf' ? stripRtfSyntax(rawText) : rawText;

    context.warnings.push(
      createFallbackParserWarning(`Se extrajo solo texto en formato ${this.format.toUpperCase()}`)
    );

    return {
      format: this.format,
      sourceName: file.name,
      mimeType: file.type,
      size: file.size,
      textContent: sanitizeLooseText(textContent),
      metadata: {
        detectedBy: context.detectedBy,
        parsedAt: new Date().toISOString(),
        bestEffort: true
      },
      warnings: context.warnings
    };
  }
}
