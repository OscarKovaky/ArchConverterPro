import { Component, inject } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { HistoryService } from '../../core/services/history.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  template: `
    <section class="card">
      <h1>Historial</h1>
      <p class="small">Últimas 25 conversiones guardadas en localStorage.</p>
      <button (click)="clear()">Limpiar historial</button>

      <table *ngIf="history.length; else empty" style="width:100%;margin-top:1rem;">
        <thead><tr><th>Archivo</th><th>Tipo</th><th>Fecha</th><th>Estado</th></tr></thead>
        <tbody>
          <tr *ngFor="let item of history">
            <td>{{ item.inputFileName }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.createdAt | date:'short' }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
      <ng-template #empty><p class="small">No hay conversiones todavía.</p></ng-template>
    </section>
  `
})
export class HistoryComponent {
  private readonly historyService = inject(HistoryService);
  history = this.historyService.getHistory();

  clear(): void {
    this.historyService.clear();
    this.history = [];
  }
}
