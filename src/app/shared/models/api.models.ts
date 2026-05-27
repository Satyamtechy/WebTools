export interface IconData {
  schema?: string;
  contributors?: string[];
  tags?: string[];
  categories?: string[];
  svg: string;
  svgName?: string;
  sanitizedSVGContent?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface LoaderData {
  id: string;
  html: string;
  css: string;
}

export interface CategoryPayload {
  category: string;
}

export type LoaderCategory =
  | 'All'
  | 'Bubble'
  | 'Graph'
  | 'Line'
  | 'Progress'
  | 'Rect'
  | 'Skeleton'
  | 'Text'
  | 'Circle'
  | 'Objects';
