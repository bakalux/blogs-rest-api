export interface IRepository<TViewModel, TInputModel> {
	getAll(): TViewModel[]
	getById(id: string): TViewModel;
	updateById(id: string, data: TInputModel): TViewModel;
	deleteById(id: string): void;
	deleteAll(): void;
	create(data: TInputModel): TViewModel;
}
