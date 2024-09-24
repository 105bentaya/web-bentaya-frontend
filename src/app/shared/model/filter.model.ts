export interface Filter {
  page: number;
  sortedBy?: string;
  asc?: boolean;
  countPerPage: number;
  [key: string]: any;
}
