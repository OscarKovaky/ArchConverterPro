import { DetectionError, UnsupportedFormatError } from '../errors/compat.errors';
import { SupportedFormat } from '../models/normalized-document.model';
import {
  createLegacyWarning,
  createMimeMismatchWarning
} from '../warnings/compatibility-warning.util';
import { CompatibilityWarning } from '../warnings/compatibility-warning.model';

const EXTENSION_MAP: Record<string, SupportedFormat> = {
  docx: 'docx',
  xlsx: 'xlsx',
  xls: 'xls',
  csv: 'csv',
  pdf: 'pdf',
  doc: 'doc',
  rtf: 'rtf',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  webp: 'image',
  bmp: 'image',
  svg: 'image'
};

const MIME_MAP: Record<string, SupportedFormat> = {
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-excel': 'xls',
  'text/csv': 'csv',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/rtf': 'rtf',
  'text/rtf': 'rtf'
};

export interface DetectionResult {
  format: SupportedFormat;
  detectedBy: 'extension' | 'mime';
  warnings: CompatibilityWarning[];
  bestEffort: boolean;
}

export class FileFormatDetector {
  detect(file: File): DetectionResult {
    const warnings: CompatibilityWarning[] = [];
    const extension = this.extractExtension(file.name);
    const extensionFormat = extension ? EXTENSION_MAP[extension] : undefined;
    const mimeFormat = file.type.startsWith('image/') ? 'image' : MIME_MAP[file.type];

    if (!extensionFormat && !mimeFormat) {
      if (!file.name) {
        throw new DetectionError('archivo_sin_nombre');
      }
      throw new UnsupportedFormatError(file.name);
    }

    if (extensionFormat && mimeFormat && extensionFormat !== mimeFormat) {
      warnings.push(createMimeMismatchWarning(extension ?? 'unknown', file.type));
    }

    const format = extensionFormat ?? mimeFormat;
    if (!format) {
      throw new DetectionError(file.name);
    }

    if (format === 'doc' || format === 'rtf') {
      warnings.push(createLegacyWarning(format));
    }

    return {
      format,
      detectedBy: extensionFormat ? 'extension' : 'mime',
      warnings,
      bestEffort: format === 'doc' || format === 'rtf'
    };
  }

  private extractExtension(name: string): string | null {
    const segments = name.toLowerCase().split('.');
    if (segments.length < 2) return null;
    return segments.pop() ?? null;
  }
}
