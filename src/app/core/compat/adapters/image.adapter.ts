import { FileAdapter, ParseContext } from '../interfaces/file-adapter.interface';
import { NormalizedDocument } from '../models/normalized-document.model';
import { readAsDataUrl } from '../services/file-reader.util';

export class ImageAdapter implements FileAdapter {
  readonly format = 'image' as const;

  async parse(file: File, context: ParseContext): Promise<NormalizedDocument> {
    const dataUrl = await readAsDataUrl(file);

    return {
      format: this.format,
      sourceName: file.name,
      mimeType: file.type,
      size: file.size,
      images: [
        {
          name: file.name,
          mimeType: file.type,
          dataUrl
        }
      ],
      metadata: {
        detectedBy: context.detectedBy,
        parsedAt: new Date().toISOString(),
        bestEffort: context.bestEffort
      },
      warnings: context.warnings
    };
  }
}
