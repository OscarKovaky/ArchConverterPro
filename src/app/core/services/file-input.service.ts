import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FileInputService {
  validateDocx(file: File | null): string | null {
    if (!file) return 'Selecciona un archivo.';
    if (!file.name.toLowerCase().endsWith('.docx')) return 'Solo se admite formato .docx en este convertidor.';
    return null;
  }
}
