export interface IService<TViewModel, TInputModel> {
	updateById(id: string, data: TInputModel): Promise<TViewModel | null>;
	deleteById(id: string): Promise<boolean>;
	deleteAll(): Promise<void>;
	create(data: TInputModel): Promise<TViewModel>;
}
