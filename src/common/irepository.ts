export interface IRepository<T, K> {
	getAll(): T[]
	getById(id: string): T;
	updateById(id: string, data: K): T;
	deleteById(id: string): void;
	deleteAll(): void;
	create(data: K): T;
}
