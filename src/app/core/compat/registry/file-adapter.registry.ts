import { Injectable } from '@angular/core';
import { AdapterNotFoundError } from '../errors/compat.errors';
import { FileAdapter } from '../interfaces/file-adapter.interface';
import { SupportedFormat } from '../models/normalized-document.model';

@Injectable({ providedIn: 'root' })
export class FileAdapterRegistry {
  private readonly adapters = new Map<SupportedFormat, FileAdapter>();

  register(adapter: FileAdapter): void {
    this.adapters.set(adapter.format, adapter);
  }

  registerMany(adapters: FileAdapter[]): void {
    adapters.forEach((adapter) => this.register(adapter));
  }

  resolve(format: SupportedFormat): FileAdapter {
    const adapter = this.adapters.get(format);
    if (!adapter) {
      throw new AdapterNotFoundError(format);
    }

    return adapter;
  }
}
