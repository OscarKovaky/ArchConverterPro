export type CompatErrorCode =
  | 'UNSUPPORTED_FORMAT'
  | 'DETECTION_FAILED'
  | 'ADAPTER_NOT_FOUND'
  | 'PARSE_FAILED';

export class CompatError extends Error {
  constructor(
    public readonly code: CompatErrorCode,
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'CompatError';
  }
}

export class UnsupportedFormatError extends CompatError {
  constructor(fileName: string) {
    super('UNSUPPORTED_FORMAT', `Formato no soportado para el archivo: ${fileName}`);
    this.name = 'UnsupportedFormatError';
  }
}

export class DetectionError extends CompatError {
  constructor(fileName: string) {
    super('DETECTION_FAILED', `No se pudo detectar el formato del archivo: ${fileName}`);
    this.name = 'DetectionError';
  }
}

export class AdapterNotFoundError extends CompatError {
  constructor(format: string) {
    super('ADAPTER_NOT_FOUND', `No existe un adapter registrado para el formato: ${format}`);
    this.name = 'AdapterNotFoundError';
  }
}

export class ParseError extends CompatError {
  constructor(fileName: string, cause?: unknown) {
    super('PARSE_FAILED', `No se pudo parsear el archivo: ${fileName}`, cause);
    this.name = 'ParseError';
  }
}
