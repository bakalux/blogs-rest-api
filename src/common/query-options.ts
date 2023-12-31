export const enum SortDirection {
    Asc = 'asc',
    Desc = 'desc',
}

export interface QueryOptions {
    sortBy: any;
    sortDirection: any;
    pageNumber: any;
    pageSize: any;
}

export interface ItemsQueryView<TViewModel> {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: TViewModel[];
}
