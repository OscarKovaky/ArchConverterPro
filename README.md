# ArchConverterPro (Angular 20 SPA)

SPA orientada a conversiones locales en navegador, con MVP **Word (.docx) → PDF** sin backend ni APIs externas.

## Stack
- Angular 20 + Standalone Components
- docx-preview (DOCX→HTML)
- html2pdf.js (HTML→PDF)
- pdfjs-dist (preview PDF)
- pdf-lib (preparado para futuras operaciones)
- xlsx/SheetJS (stubs para futuro)

## Estructura
Ver `src/app` con arquitectura por features:
- `core`: modelos, servicios, utilidades
- `shared`: componentes reutilizables (ej. slots de anuncio)
- `features`: home, converters, history, ads, preview, settings
- `layout`: shell, header, footer

## Flujo Word a PDF
1. Selección y validación de `.docx`
2. Render DOCX a HTML con `docx-preview`
3. Configuración de opciones de exportación
4. Exportación a PDF con `html2pdf.js`
5. Preview primera página de PDF con `pdfjs-dist`
6. Descarga y registro en historial localStorage

## Notas
La conversión Word→PDF se basa en render HTML intermedio y no promete fidelidad pixel-perfect respecto a Microsoft Word.
