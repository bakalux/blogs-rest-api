import { BlogDbModel, BlogDbUpdateModel, BlogDbViewModel } from './blogs-model';
import { getCollection } from "../../db";

export class BlogsRepository {
	private _collection = getCollection<BlogDbModel>('blogs');

	public async create(data: BlogDbModel): Promise<BlogDbViewModel> {
		await this._collection.insertOne({ ...data });

		return data;
	}

	public async updateById(id: string, data: BlogDbUpdateModel): Promise<BlogDbViewModel | null> {
		const result = await this._collection.updateOne(
			{ id },
			{ $set: data },
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
