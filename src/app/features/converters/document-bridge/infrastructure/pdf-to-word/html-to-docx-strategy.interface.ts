export interface HtmlToDocxStrategy {
  buildFromHtml(html: string, outputFileName: string): Promise<Blob>;
}
