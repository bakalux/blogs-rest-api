export interface IRepository<TViewModel, TInputModel> {
	getAll(): Promise<TViewModel[]>;
	getById(id: string): Promise<TViewModel | null>;
	updateById(id: string, data: TInputModel): Promise<TViewModel | null>;
	deleteById(id: string): Promise<boolean>;
	deleteAll(): Promise<void>;
	create(data: TInputModel): Promise<TViewModel>;
}
