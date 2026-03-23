import { Injectable } from '@angular/core';
import { ConversionDirection } from '../../domain/conversion-direction.type';

@Injectable({ providedIn: 'root' })
export class FileInputService {
  detectDirection(file: File | null): ConversionDirection | null {
    if (!file) return null;
    const name = file.name.toLowerCase();
    if (name.endsWith('.docx')) return 'word-to-pdf';
    if (name.endsWith('.pdf')) return 'pdf-to-word';
    return null;
  }

  validate(file: File | null): string | null {
    if (!file) return 'Selecciona un archivo .docx o .pdf.';
    return this.detectDirection(file) ? null : 'Formato no soportado. Solo .docx y .pdf.';
  }
}
