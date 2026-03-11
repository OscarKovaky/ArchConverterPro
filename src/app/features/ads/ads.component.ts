import { Component, inject } from '@angular/core';
import { AdsService } from '../../core/services/ads.service';
import { AdSlotComponent } from '../../shared/components/ad-slot.component';

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [AdSlotComponent],
  template: `<app-ad-slot [config]="config" />`
})
export class AdsComponent {
  private readonly adsService = inject(AdsService);
  config = this.adsService.getSlot('homeTop');
}
