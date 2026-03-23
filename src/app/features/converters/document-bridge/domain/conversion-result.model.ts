import { ConversionDirection } from './conversion-direction.type';
import { ConversionWarning } from './conversion-warning.model';
import { FidelityLevel } from './fidelity-level.type';

export interface ConversionResult {
  direction: ConversionDirection;
  outputFileName: string;
  blob: Blob;
  summary: string;
  fidelity: FidelityLevel;
  warnings: ConversionWarning[];
}
