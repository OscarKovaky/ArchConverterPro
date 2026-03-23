import { ConversionDirection } from './conversion-direction.type';
import { FidelityLevel } from './fidelity-level.type';

export interface ConversionJob {
  id: string;
  createdAt: string;
  inputFileName: string;
  outputFileName: string;
  direction: ConversionDirection;
  fidelity: FidelityLevel;
  status: 'success' | 'error';
  summary: string;
}
