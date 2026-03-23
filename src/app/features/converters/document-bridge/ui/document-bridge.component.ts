import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { DocumentBridgeFacade } from '../application/document-bridge.facade';
import { ConversionDirection } from '../domain/conversion-direction.type';
import { ConversionResult } from '../domain/conversion-result.model';
import { FileInputService } from '../infrastructure/shared/file-input.service';

@Component({
  selector: 'app-document-bridge',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe],
  template: `
    <section class="card">
      <h1>Document Bridge (DOCX ⇄ PDF)</h1>
      <p class="small">Todo ocurre en tu navegador: sin backend y sin APIs externas.</p>

      <div class="dropzone" [class.dragging]="dragging" (dragover)="onDragOver($event)" (dragleave)="onDragLeave()" (drop)="onDrop($event)">
        <p>Arrastra un .docx o .pdf aquí</p>
        <input type="file" accept=".docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" (change)="onFileInput($event)" />
      </div>

      <p *ngIf="fileError" class="error">{{ fileError }}</p>

      <div *ngIf="selectedFile && direction" class="pill-row">
        <span class="pill">Archivo: {{ selectedFile.name }}</span>
        <span class="pill">Flujo: {{ direction }}</span>
        <span class="pill" [ngClass]="fidelityClass">Fidelidad esperada: {{ result?.fidelity ?? expectedFidelity }}</span>
      </div>

      <button (click)="convert()" [disabled]="!selectedFile || !direction || loading">
        {{ loading ? 'Convirtiendo...' : actionLabel }}
      </button>
    </section>

    <section class="grid-2" style="margin-top: 1rem">
      <article class="card">
        <h2>Preview origen</h2>
        <div *ngIf="direction === 'word-to-pdf'; else pdfSummary" #docxPreviewHost class="preview-host"></div>
        <ng-template #pdfSummary>
          <p *ngIf="selectedFile" class="small">PDF seleccionado: {{ selectedFile.name }}</p>
          <p class="small">En PDF → Word se extrae texto por página para reconstruir un .docx editable.</p>
        </ng-template>
      </article>

      <article class="card">
        <h2>Resultado</h2>
        <p *ngIf="result; else idle" class="small">{{ result.summary }}</p>
        <ng-template #idle><p class="small">Aún no hay conversión ejecutada.</p></ng-template>

        <ul *ngIf="warnings.length" class="warning-list">
          <li *ngFor="let warning of warnings">⚠️ {{ warning.message }}</li>
        </ul>

        <button *ngIf="result" (click)="downloadResult()">Descargar {{ result.outputFileName }}</button>
      </article>
    </section>

    <section class="card" style="margin-top: 1rem">
      <h2>Historial local</h2>
      <p class="small">Últimas conversiones almacenadas en localStorage.</p>
      <table *ngIf="history.length; else noHistory" class="history-table">
        <thead>
          <tr><th>Fecha</th><th>Entrada</th><th>Flujo</th><th>Salida</th><th>Fidelidad</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of history">
            <td>{{ item.createdAt | date: 'short' }}</td>
            <td>{{ item.inputFileName }}</td>
            <td>{{ item.direction }}</td>
            <td>{{ item.outputFileName }}</td>
            <td>{{ item.fidelity }}</td>
          </tr>
        </tbody>
      </table>
      <ng-template #noHistory><p class="small">Todavía no hay conversiones en este módulo.</p></ng-template>
    </section>
  `,
  styles: [
    `.dropzone{border:2px dashed #6f83bd;border-radius:14px;padding:1rem;margin:1rem 0}.dropzone.dragging{border-color:#89c2ff;background:rgba(137,194,255,.08)}
    .error{color:var(--danger)} .preview-host{min-height:240px;max-height:420px;overflow:auto;padding:.5rem;background:#10162a;border-radius:10px}
    .pill-row{display:flex;gap:.5rem;flex-wrap:wrap;margin:.75rem 0}.pill{padding:.35rem .6rem;border-radius:999px;background:#26345f;font-size:.85rem}
    .pill.high{background:#1b6e4d}.pill.medium{background:#845e18}.pill.low{background:#8e3030}
    .warning-list{margin:.75rem 0 1rem;padding-left:1rem}.warning-list li{margin-bottom:.35rem}
    .history-table{width:100%;margin-top:.75rem;border-collapse:collapse}.history-table th,.history-table td{padding:.5rem;border-bottom:1px solid rgba(255,255,255,.1);text-align:left}`
  ]
})
export class DocumentBridgeComponent {
  private readonly facade = inject(DocumentBridgeFacade);
  private readonly fileInput = inject(FileInputService);

  @ViewChild('docxPreviewHost') docxPreviewHost?: ElementRef<HTMLElement>;

  selectedFile: File | null = null;
  direction: ConversionDirection | null = null;
  result: ConversionResult | null = null;
  warnings = this.result?.warnings ?? [];
  fileError = '';
  loading = false;
  dragging = false;
  history = this.facade.getHistory();

  get actionLabel(): string {
    if (this.direction === 'word-to-pdf') return 'Convertir a PDF';
    if (this.direction === 'pdf-to-word') return 'Convertir a Word (.docx)';
    return 'Convertir';
  }

  get expectedFidelity(): string {
    return this.direction === 'word-to-pdf' ? 'high' : this.direction === 'pdf-to-word' ? 'medium' : '-';
  }

  get fidelityClass(): string {
    return this.result?.fidelity ?? this.expectedFidelity;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave(): void {
    this.dragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    this.prepareFile(event.dataTransfer?.files?.[0] ?? null);
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.prepareFile(input.files?.[0] ?? null);
  }

  async convert(): Promise<void> {
    if (!this.selectedFile || !this.direction) return;

    this.loading = true;
    this.fileError = '';

    try {
      if (this.direction === 'word-to-pdf') {
        if (!this.docxPreviewHost?.nativeElement) {
          throw new Error('No se encontró el contenedor de preview DOCX');
        }

        this.result = await this.facade.convertWordToPdf(this.selectedFile, this.docxPreviewHost.nativeElement);
      } else {
        this.result = await this.facade.convertPdfToWord(this.selectedFile);
      }

      this.warnings = this.result.warnings;
      this.history = this.facade.getHistory();
    } catch {
      this.fileError = 'La conversión falló. Revisa el archivo e inténtalo nuevamente.';
    } finally {
      this.loading = false;
    }
  }

  downloadResult(): void {
    if (!this.result) return;
    this.facade.download(this.result.blob, this.result.outputFileName);
  }

  private async prepareFile(file: File | null): Promise<void> {
    this.fileError = this.fileInput.validate(file) ?? '';
    if (!file || this.fileError) return;

    this.selectedFile = file;
    this.direction = this.fileInput.detectDirection(file);
    this.result = null;
    this.warnings = [];

    if (this.direction === 'word-to-pdf' && this.docxPreviewHost?.nativeElement) {
      await this.facade.renderWordPreview(file, this.docxPreviewHost.nativeElement);
    }
  }
}
