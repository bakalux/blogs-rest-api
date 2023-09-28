export interface IRepository<TViewModel, TInputModel> {
    updateById(id: string, data: TInputModel): Promise<TViewModel | null>;

    deleteById(id: string): Promise<boolean>;

    deleteAll(): Promise<void>;

    create(data: TViewModel): Promise<TViewModel>;
}
