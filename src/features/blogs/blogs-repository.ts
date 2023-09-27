import { BlogInputModel, BlogViewModel } from './blogs-model';
import { IRepository } from '../../common/irepository';
import { getCollection } from "../../db";

export class BlogsRepository implements  IRepository<BlogViewModel, BlogInputModel>{
	private _collection = getCollection<BlogViewModel>('blogs');

	public async getAll(): Promise<BlogViewModel[]> {
		return await this._collection.find({}, { projection: { _id: 0  }}).toArray();
	}

	public async getById(id: string): Promise<BlogViewModel | null> {
		const blog = await this._collection.findOne({ id }, { projection: { _id: 0  }});
		if (!blog) {
			return null;
		}

		return blog;
	}

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
