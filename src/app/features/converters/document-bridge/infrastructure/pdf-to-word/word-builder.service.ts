import { Injectable } from '@angular/core';
import { strToU8, zipSync } from 'fflate';
import { NormalizedDocumentModel } from '../../domain/normalized-document.model';

@Injectable({ providedIn: 'root' })
export class WordBuilderService {
  async buildDocx(model: NormalizedDocumentModel): Promise<Blob> {
    const documentXml = this.buildDocumentXml(model);

    const zipContent = zipSync({
      '[Content_Types].xml': strToU8(this.contentTypesXml()),
      '_rels/.rels': strToU8(this.rootRelsXml()),
      'docProps/app.xml': strToU8(this.appXml()),
      'docProps/core.xml': strToU8(this.coreXml(model.title)),
      'word/document.xml': strToU8(documentXml),
      'word/_rels/document.xml.rels': strToU8(this.wordRelsXml())
    });

    return new Blob([zipContent], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
  }

  private buildDocumentXml(model: NormalizedDocumentModel): string {
    const blocks = model.pages
      .map((page) => {
        const heading = this.paragraph(`Página ${page.pageNumber}`);
        const text = this.paragraph(page.text || '[Sin texto extraíble en esta página]');
        return `${heading}${text}`;
      })
      .join('');

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${this.paragraph(model.title, true)}
    ${blocks}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;
  }

  private paragraph(text: string, bold = false): string {
    const escaped = text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
    const runProperties = bold ? '<w:rPr><w:b/></w:rPr>' : '';

    return `<w:p><w:r>${runProperties}<w:t xml:space="preserve">${escaped}</w:t></w:r></w:p>`;
  }

  private contentTypesXml(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;
  }

  private rootRelsXml(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
  }

  private wordRelsXml(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`;
  }

  private appXml(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
 xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>ArchConverterPro</Application>
</Properties>`;
  }

  private coreXml(title: string): string {
    const now = new Date().toISOString();
    const escapedTitle = title.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
 xmlns:dc="http://purl.org/dc/elements/1.1/"
 xmlns:dcterms="http://purl.org/dc/terms/"
 xmlns:dcmitype="http://purl.org/dc/dcmitype/"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${escapedTitle}</dc:title>
  <dc:creator>ArchConverterPro</dc:creator>
  <cp:lastModifiedBy>ArchConverterPro</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`;
  }
}
