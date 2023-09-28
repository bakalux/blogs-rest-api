import { BlogInputModel, BlogViewModel } from './blogs-model';
import { IRepository } from '../../common/irepository';
import { getCollection } from "../../db";

export class BlogsRepository implements  IRepository<BlogViewModel, BlogInputModel>{
	private _collection = getCollection<BlogViewModel>('blogs');

	public async create(data: BlogViewModel): Promise<BlogViewModel> {
		await this._collection.insertOne({ ...data });

		return data;
	}

	public async updateById(id: string, data: BlogInputModel): Promise<BlogViewModel | null> {
		const updating = {
			...data,
			id
		}
		const result = await this._collection.updateOne(
			{ id },
			{ $set: updating },
		);

		if (result.matchedCount === 0) {
			return null;
		}

		const updated = await this._collection.findOne({ id }, { projection: { _id: 0  }});

		return updated;
	}

	public async deleteById(id: string): Promise<boolean> {
		const result = await this._collection.deleteOne({ id });

		return result.deletedCount !== 0;
	}

	public async deleteAll(): Promise<void> {
		await this._collection.deleteMany({});
	}
}
