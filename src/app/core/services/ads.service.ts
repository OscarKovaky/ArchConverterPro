import { Injectable } from '@angular/core';
import { AdSlotConfig } from '../models/ad-slot-config.model';

@Injectable({ providedIn: 'root' })
export class AdsService {
  getSlot(slotId: string): AdSlotConfig {
    const catalog: Record<string, AdSlotConfig> = {
      homeTop: { slotId: 'homeTop', title: 'Anuncio principal', description: 'Espacio reservado para partners o AdSense.' },
      converterSide: { slotId: 'converterSide', title: 'Anuncio secundario', description: 'Bloque reutilizable para monetización futura.' }
    };
    return catalog[slotId] ?? { slotId, title: 'Ad Slot', description: 'Configurar proveedor de anuncios.' };
  }
}
