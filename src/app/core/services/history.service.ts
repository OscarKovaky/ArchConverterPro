import { Injectable } from '@angular/core';
import { ConversionJob } from '../models/conversion-job.model';

const STORAGE_KEY = 'arch-converter-history';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  getHistory(): ConversionJob[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as ConversionJob[] : [];
  }

  addJob(job: ConversionJob): void {
    const history = [job, ...this.getHistory()].slice(0, 25);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
