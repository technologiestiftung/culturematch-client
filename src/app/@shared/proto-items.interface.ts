interface ProtoItemsMeta {
  isFirstLoad?: boolean,
  isRefreshing?: boolean,
  isLoading?: boolean,
  hasMore?: boolean,
  totalCount?: number,
  error?: any,
  whereFilter?: any,
  orderBy?: string,
  filterIsActive?: boolean,
  search?: { [key: string]: any },
}

export interface ProtoItems {
  items: any[],
  meta: ProtoItemsMeta,
}