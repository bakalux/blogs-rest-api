import { BlogInputModel, BlogViewModel } from './blogs-model';
import { IQueryRepository } from '../../common/iquery-repository';
import { getCollection } from "../../db";

export class BlogsQueryRepository implements IQueryRepository<BlogViewModel, BlogInputModel> {
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
}
