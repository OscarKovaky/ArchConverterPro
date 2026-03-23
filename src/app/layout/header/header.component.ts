import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="container topbar">
      <a routerLink="" class="brand">ArchConverterPro</a>
      <nav>
        <a routerLink="" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Inicio</a>
        <a routerLink="/converters/document-bridge" routerLinkActive="active">Document Bridge</a>
        <a routerLink="/history" routerLinkActive="active">Historial</a>
      </nav>
    </header>
  `,
  styles: [`.topbar{display:flex;justify-content:space-between;align-items:center;padding:1rem 0}.brand{font-weight:700;color:#fff;text-decoration:none}nav{display:flex;gap:1rem}a{color:#cfd8ff;text-decoration:none}.active{color:#fff}`]
})
export class HeaderComponent {}
