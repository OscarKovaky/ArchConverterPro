import { Injectable } from '@angular/core';
import { renderAsync } from 'docx-preview';

@Injectable({ providedIn: 'root' })
export class WordRenderService {
  async render(file: File, container: HTMLElement): Promise<void> {
    container.innerHTML = '';
    const data = await file.arrayBuffer();
    await renderAsync(data, container, undefined, {
      className: 'docx',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false
    });
  }
}
