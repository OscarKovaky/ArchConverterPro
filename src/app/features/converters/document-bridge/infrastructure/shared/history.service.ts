import { Injectable } from '@angular/core';
import { ConversionJob } from '../../domain/conversion-job.model';

const STORAGE_KEY = 'arch-converter-document-bridge-history';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  getAll(): ConversionJob[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConversionJob[]) : [];
  }

  add(job: ConversionJob): void {
    const next = [job, ...this.getAll()].slice(0, 25);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}
