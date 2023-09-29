export interface IQueryRepository<TViewModel> {
    getAll(query: object): Promise<TViewModel[]>;

    getById(id: string): Promise<TViewModel | null>;
}

export const enum SortDirection {
    Asc = 'asc',
    Desc = 'desc',
}

export interface QueryOptions {
    searchNameTerm: any;
    sortBy: any;
    sortDirection: any;
    pageNumber: any;
    pageSize: any;
}
