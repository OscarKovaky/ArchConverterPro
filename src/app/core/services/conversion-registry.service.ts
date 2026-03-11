import { Injectable } from '@angular/core';
import { ConversionType } from '../models/conversion-type.model';

@Injectable({ providedIn: 'root' })
export class ConversionRegistryService {
  private readonly conversions: Array<{ type: ConversionType; label: string; route: string; enabled: boolean }> = [
    { type: 'word-to-pdf', label: 'Word a PDF', route: '/converters/word-to-pdf', enabled: true },
    { type: 'image-to-pdf', label: 'Imagen a PDF', route: '/converters/image-to-pdf', enabled: false },
    { type: 'excel-to-pdf', label: 'Excel/CSV a PDF', route: '/converters/excel-to-pdf', enabled: false }
  ];

  list() {
    return this.conversions;
  }
}
