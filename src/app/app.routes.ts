import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent) },
      { path: 'converters/word-to-pdf', loadComponent: () => import('./features/converters/word-to-pdf/word-to-pdf.component').then((m) => m.WordToPdfComponent) },
      { path: 'converters/document-bridge', loadComponent: () => import('./features/converters/document-bridge/ui/document-bridge.component').then((m) => m.DocumentBridgeComponent) },
      { path: 'converters/image-to-pdf', loadComponent: () => import('./features/converters/image-to-pdf/image-to-pdf.component').then((m) => m.ImageToPdfComponent) },
      { path: 'converters/excel-to-pdf', loadComponent: () => import('./features/converters/excel-to-pdf/excel-to-pdf.component').then((m) => m.ExcelToPdfComponent) },
      { path: 'history', loadComponent: () => import('./features/history/history.component').then((m) => m.HistoryComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then((m) => m.SettingsComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
