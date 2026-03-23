export interface NormalizedPage {
  pageNumber: number;
  text: string;
}

export interface NormalizedDocumentModel {
  title: string;
  pages: NormalizedPage[];
}
