import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AdsService } from '../../../core/services/ads.service';
import { FileInputService } from '../../../core/services/file-input.service';
import { HistoryService } from '../../../core/services/history.service';
import { PdfExportService } from '../../../core/services/pdf-export.service';
import { PdfPreviewService } from '../../../core/services/pdf-preview.service';
import { WordRenderService } from '../../../core/services/word-render.service';
import { ExportOptions } from '../../../core/models/export-options.model';
import { AdSlotComponent } from '../../../shared/components/ad-slot.component';

@Component({
  selector: 'app-word-to-pdf',
  standalone: true,
  imports: [NgIf, FormsModule, AdSlotComponent],
  template: `
    <section class="grid-2">
      <div class="card">
        <h1>Word a PDF</h1>
        <input type="file" accept=".docx" (change)="onFileSelected($event)" />
        <p *ngIf="error" style="color:var(--danger)">{{ error }}</p>
        <p *ngIf="loading" class="small">Procesando archivo...</p>

        <h3>Opciones de exportación</h3>
        <div class="grid-2">
          <label>Nombre <input [(ngModel)]="options.fileName" /></label>
          <label>Orientación
            <select [(ngModel)]="options.orientation"><option value="portrait">Vertical</option><option value="landscape">Horizontal</option></select>
          </label>
          <label>Tamaño
            <select [(ngModel)]="options.format"><option value="a4">A4</option><option value="letter">Letter</option></select>
          </label>
          <label>Margen (in) <input type="number" min="0" step="0.1" [(ngModel)]="options.margin" /></label>
        </div>

        <div style="display:flex;gap:.75rem;margin-top:1rem;">
          <button (click)="convert()" [disabled]="!selectedFile || loading">Convertir</button>
          <button (click)="download()" [disabled]="!pdfBlob">Descargar PDF</button>
        </div>
      </div>

      <app-ad-slot [config]="adConfig" />
    </section>

    <section class="grid-2" style="margin-top:1rem;">
      <div class="card"><h3>Preview DOCX (HTML)</h3><div #docxHost></div></div>
      <div class="card"><h3>Preview PDF (primera página)</h3><canvas #pdfCanvas></canvas></div>
    </section>
  `
})
export class WordToPdfComponent {
  private readonly fileInputService = inject(FileInputService);
  private readonly wordRenderService = inject(WordRenderService);
  private readonly pdfExportService = inject(PdfExportService);
  private readonly pdfPreviewService = inject(PdfPreviewService);
  private readonly historyService = inject(HistoryService);
  private readonly adsService = inject(AdsService);

  @ViewChild('docxHost') docxHost?: ElementRef<HTMLElement>;
  @ViewChild('pdfCanvas') pdfCanvas?: ElementRef<HTMLCanvasElement>;

  adConfig = this.adsService.getSlot('converterSide');
  options: ExportOptions = { fileName: 'documento-convertido.pdf', orientation: 'portrait', margin: 0.4, format: 'a4' };
  selectedFile: File | null = null;
  pdfBlob: Blob | null = null;
  loading = false;
  error = '';

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.error = this.fileInputService.validateDocx(file) ?? '';
    if (this.error || !file) return;

    this.selectedFile = file;
    this.options.fileName = file.name.replace(/\.docx$/i, '.pdf');
    if (!this.docxHost?.nativeElement) return;

    this.loading = true;
    try {
      await this.wordRenderService.renderDocx(file, this.docxHost.nativeElement);
      this.pdfBlob = null;
    } catch {
      this.error = 'No se pudo renderizar el DOCX.';
    } finally {
      this.loading = false;
    }
  }

  async convert(): Promise<void> {
    if (!this.docxHost?.nativeElement || !this.selectedFile) return;
    this.loading = true;
    this.error = '';

    try {
      this.pdfBlob = await this.pdfExportService.exportElementToPdfBlob(this.docxHost.nativeElement, this.options);
      if (this.pdfBlob && this.pdfCanvas?.nativeElement) {
        await this.pdfPreviewService.renderFirstPage(this.pdfBlob, this.pdfCanvas.nativeElement);
      }
      this.historyService.addJob({
        id: crypto.randomUUID?.() ?? String(Date.now()),
        type: 'word-to-pdf',
        inputFileName: this.selectedFile.name,
        outputFileName: this.options.fileName,
        createdAt: new Date().toISOString(),
        status: 'success'
      });
    } catch (err) {
      this.error = 'Error durante la conversión a PDF.';
      this.historyService.addJob({
        id: crypto.randomUUID?.() ?? String(Date.now()),
        type: 'word-to-pdf',
        inputFileName: this.selectedFile.name,
        outputFileName: this.options.fileName,
        createdAt: new Date().toISOString(),
        status: 'error',
        errorMessage: String(err)
      });
    } finally {
      this.loading = false;
    }
  }

  download(): void {
    if (!this.pdfBlob) return;
    const url = URL.createObjectURL(this.pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.options.fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
}
