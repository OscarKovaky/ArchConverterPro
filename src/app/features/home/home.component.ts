import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { ConversionRegistryService } from '../../core/services/conversion-registry.service';
import { AdsService } from '../../core/services/ads.service';
import { AdSlotComponent } from '../../shared/components/ad-slot.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, AdSlotComponent],
  template: `
    <section class="card">
      <h1>Convierte archivos localmente</h1>
      <p class="small">Tus documentos no salen del navegador. Sin backend y sin APIs externas.</p>
      <div class="dropzone">Arrastra tu archivo .docx aquí o abre el convertidor principal.</div>
      <button routerLink="/converters/document-bridge">Abrir convertidor</button>
    </section>

    <section class="card" style="margin-top:1rem;">
      <h2>Conversiones disponibles</h2>
      <ul>
        <li *ngFor="let c of conversions">
          <a [routerLink]="c.route">{{ c.label }}</a>
          <span class="small"> · {{ c.enabled ? 'Disponible' : 'Próximamente' }}</span>
        </li>
      </ul>
      <a routerLink="/history">Ver historial</a>
    </section>

    <app-ad-slot [config]="adConfig" />
  `,
  styles: [`.dropzone{border:2px dashed #6f83bd;border-radius:14px;padding:1rem;margin:1rem 0;color:#a9b3d0}`]
})
export class HomeComponent {
  private readonly registry = inject(ConversionRegistryService);
  private readonly ads = inject(AdsService);
  conversions = this.registry.list();
  adConfig = this.ads.getSlot('homeTop');
}
