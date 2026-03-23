import { inject } from '@angular/core';
import { CompatParserService } from '../services/compat-parser.service';

export class CompatUsageExample {
  private readonly compatParser = inject(CompatParserService);

  async handleSelectedFile(file: File): Promise<void> {
    const normalized = await this.compatParser.parseFile(file);

    console.log('Formato detectado:', normalized.format);
    console.log('Warnings:', normalized.warnings);
    console.log('Documento normalizado:', normalized);
  }
}
