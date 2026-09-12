export type SearchResultType = "post" | "thought" | "event";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  snippet: string;
  rawTitle?: string;
  rawSnippet?: string;
  href: string;
  publishedAt: string;
}

export interface SearchHighlightSegment {
  text: string;
  matched: boolean;
  start: number;
}

export type SearchContentOptions = {
  searchRawText?: boolean;
};
