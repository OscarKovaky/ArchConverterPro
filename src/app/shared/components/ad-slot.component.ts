import { Component, Input } from '@angular/core';
import { AdSlotConfig } from '../../core/models/ad-slot-config.model';

@Component({
  selector: 'app-ad-slot',
  standalone: true,
  template: `
    <aside class="card ad-slot">
      <strong>{{ config.title }}</strong>
      <p class="small">{{ config.description }}</p>
      <span class="tag">{{ config.slotId }}</span>
    </aside>
  `,
  styles: [`.ad-slot{min-height:120px;display:flex;flex-direction:column;gap:.5rem;justify-content:center}.tag{font-size:.75rem;color:#8aa6ff}`]
})
export class AdSlotComponent {
  @Input({ required: true }) config!: AdSlotConfig;
}
