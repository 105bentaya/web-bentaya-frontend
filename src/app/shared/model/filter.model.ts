export interface PagedFilter {
  page: number;
  sortedBy?: string;
  asc?: boolean;
  countPerPage: number;
  [key: string]: any;
}

export interface Filter {
  [key: string]: any
}
