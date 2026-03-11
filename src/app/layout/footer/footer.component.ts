import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `<footer class="container small footer">Procesamiento local en tu navegador · Sin backend · MVP Word a PDF</footer>`,
  styles: [`.footer{padding:2rem 0;opacity:.9}`]
})
export class FooterComponent {}
