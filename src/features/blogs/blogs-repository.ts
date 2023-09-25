import { BlogInputModel, BlogViewModel } from './blogs-model';
import { IRepository } from '../../common/irepository';
import { getCollection } from "../../db";

class BlogsRepository implements  IRepository<BlogViewModel, BlogInputModel>{
	private _collection = getCollection<BlogViewModel>('blogs');

	public async getAll(): Promise<BlogViewModel[]> {
		return await this._collection.find({}, { projection: { _id: false } }).toArray();
	}

	public async getById(id: string): Promise<BlogViewModel | null> {
		const blog = await this._collection.findOne({ id }, { projection: { _id: false } });
		if (!blog) {
			return null;
		}

		return blog;
	}

	public async create(data: BlogInputModel): Promise<BlogViewModel> {
		const blog = {
			...data,
			id: Date.now().toString(),
		};

		await this._collection.insertOne(blog);

		return blog;
	}

	public async updateById(id: string, data: BlogInputModel): Promise<BlogViewModel | null> {
		const updating = {
			...data,
			id
		}
		const result = await this._collection.updateOne(
			{ id },
			updating
		);

		if (result.matchedCount === 0) {
			return null;
		}

		return updating;
	}

	public async deleteById(id: string): Promise<boolean> {
		const result = await this._collection.deleteOne({ id });

		return result.deletedCount !== 0;
	}

	public async deleteAll(): Promise<void> {
		await this._collection.deleteMany();
	}
}

export const blogsRepository = new BlogsRepository();
