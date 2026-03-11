import { ConversionType } from './conversion-type.model';

export interface ConversionJob {
  id: string;
  type: ConversionType;
  inputFileName: string;
  outputFileName: string;
  createdAt: string;
  status: 'success' | 'error';
  errorMessage?: string;
}
