import { NormalizedDocument, SupportedFormat } from '../models/normalized-document.model';
import { CompatibilityWarning } from '../warnings/compatibility-warning.model';

export interface ParseContext {
  detectedBy: 'extension' | 'mime';
  warnings: CompatibilityWarning[];
  bestEffort: boolean;
}

export interface FileAdapter {
  readonly format: SupportedFormat;
  parse(file: File, context: ParseContext): Promise<NormalizedDocument>;
}
