import { CompatibilityWarning } from './compatibility-warning.model';

export const createLegacyWarning = (extension: string): CompatibilityWarning => ({
  code: 'LEGACY_BEST_EFFORT',
  message: `El formato legacy .${extension} se procesa en modo best effort y puede perder formato.`
});

export const createMimeMismatchWarning = (
  extension: string,
  mimeType: string
): CompatibilityWarning => ({
  code: 'MIME_EXTENSION_MISMATCH',
  message: `El tipo MIME (${mimeType || 'desconocido'}) no coincide con la extensión .${extension}.`
});

export const createFallbackParserWarning = (reason: string): CompatibilityWarning => ({
  code: 'FALLBACK_PARSER',
  message: `Se usó parser de fallback: ${reason}`
});
