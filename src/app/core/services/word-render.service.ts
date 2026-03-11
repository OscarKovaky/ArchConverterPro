import { Injectable } from '@angular/core';
import { renderAsync } from 'docx-preview';

@Injectable({ providedIn: 'root' })
export class WordRenderService {
  async renderDocx(file: File, container: HTMLElement): Promise<void> {
    container.innerHTML = '';
    const buffer = await file.arrayBuffer();
    await renderAsync(buffer, container, undefined, {
      className: 'docx',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false
    });
  }
}
