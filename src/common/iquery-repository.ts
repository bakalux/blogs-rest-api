export interface IQueryRepository<TViewModel> {
    getAll(options: Partial<QueryOptions>): Promise<TViewModel[]>;

    getById(id: string): Promise<TViewModel | null>;
}

export const enum SortDirection {
    Asc = 'asc',
    Desc = 'desc',
}

export interface QueryOptions {
    searchNameTerm: string;
    sortBy: string;
    sortDirection: SortDirection;
    pageNumber: number;
    pageSize: number;
}
