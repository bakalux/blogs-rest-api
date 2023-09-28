export interface IQueryRepository<TViewModel, TInputModel> {
    getAll(): Promise<TViewModel[]>;

    getById(id: string): Promise<TViewModel | null>;
}
