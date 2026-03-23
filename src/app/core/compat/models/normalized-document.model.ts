import { CompatibilityWarning } from '../warnings/compatibility-warning.model';

export type SupportedFormat = 'docx' | 'xlsx' | 'xls' | 'csv' | 'image' | 'pdf' | 'doc' | 'rtf';

export interface NormalizedTable {
  name?: string;
  rows: string[][];
}

export interface NormalizedPage {
  index: number;
  text?: string;
}

export interface NormalizedImage {
  name: string;
  mimeType: string;
  dataUrl?: string;
}

export interface NormalizedDocument {
  format: SupportedFormat;
  sourceName: string;
  mimeType: string;
  size: number;
  textContent?: string;
  tables?: NormalizedTable[];
  pages?: NormalizedPage[];
  images?: NormalizedImage[];
  metadata: {
    detectedBy: 'extension' | 'mime';
    parsedAt: string;
    bestEffort: boolean;
  };
  warnings: CompatibilityWarning[];
}
