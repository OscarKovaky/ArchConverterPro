import { DocumentBridgeFacade } from './document-bridge.facade';

export async function convertWordExample(facade: DocumentBridgeFacade, file: File, previewHost: HTMLElement): Promise<void> {
  await facade.renderWordPreview(file, previewHost);
  const result = await facade.convertWordToPdf(file, previewHost);
  facade.download(result.blob, result.outputFileName);
}

export async function convertPdfExample(facade: DocumentBridgeFacade, file: File): Promise<void> {
  const result = await facade.convertPdfToWord(file);
  facade.download(result.blob, result.outputFileName);
}
