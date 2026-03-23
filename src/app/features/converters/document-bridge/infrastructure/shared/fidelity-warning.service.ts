import { Injectable } from '@angular/core';
import { ConversionDirection } from '../../domain/conversion-direction.type';
import { ConversionWarning } from '../../domain/conversion-warning.model';
import { FidelityLevel } from '../../domain/fidelity-level.type';

@Injectable({ providedIn: 'root' })
export class FidelityWarningService {
  getFidelity(direction: ConversionDirection): FidelityLevel {
    return direction === 'word-to-pdf' ? 'high' : 'medium';
  }

  buildWarnings(direction: ConversionDirection): ConversionWarning[] {
    if (direction === 'word-to-pdf') {
      return [
        {
          code: 'W2P_RENDER',
          direction,
          level: 'low',
          message: 'La fidelidad visual suele ser alta, pero puede variar con fuentes no disponibles.'
        }
      ];
    }

    return [
      {
        code: 'P2W_LAYOUT',
        direction,
        level: 'medium',
        message: 'PDF → Word reconstruye contenido editable; no replica layout exacto del PDF original.'
      },
      {
        code: 'P2W_OBJECTS',
        direction,
        level: 'medium',
        message: 'Tablas complejas, imágenes o columnas pueden requerir ajuste manual en Word.'
      }
    ];
  }
}
