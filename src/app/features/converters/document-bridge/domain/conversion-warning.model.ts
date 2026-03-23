import { ConversionDirection } from './conversion-direction.type';
import { FidelityLevel } from './fidelity-level.type';

export interface ConversionWarning {
  code: string;
  direction: ConversionDirection;
  level: FidelityLevel;
  message: string;
}
