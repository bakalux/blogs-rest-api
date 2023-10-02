import { PostDbModel, PostDbUpdateModel, PostDbViewModel } from './posts-model';
import { getCollection } from "../../db";

export class PostsRepository {
	private _collection = getCollection<PostDbModel>('posts');

	public async create(data: PostDbModel): Promise<PostDbViewModel> {
		await this._collection.insertOne({ ...data });
		return data;
	}

	public async updateById(id: string, data: PostDbUpdateModel): Promise<PostDbViewModel | null> {
		const updating = {
			...data,
			id,
		};

		const result = await this._collection.updateOne({ id }, { $set: updating });

		if (result.matchedCount === 0) {
			return null;
		}

		const updated = await this._collection.findOne({id}, { projection: {_id: 0 } });

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
