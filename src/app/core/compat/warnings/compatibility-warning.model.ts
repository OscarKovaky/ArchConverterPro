export type CompatibilityWarningCode =
  | 'LEGACY_BEST_EFFORT'
  | 'MIME_EXTENSION_MISMATCH'
  | 'PARTIAL_CONTENT'
  | 'FALLBACK_PARSER';

export interface CompatibilityWarning {
  code: CompatibilityWarningCode;
  message: string;
}
