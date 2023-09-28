import { PostInputModel, PostViewModel } from './posts-model';
import { IQueryRepository } from '../../common/iquery-repository';
import { getCollection } from "../../db";

export class PostsQueryRepository implements  IQueryRepository<PostViewModel, PostInputModel>{
	private _collection = getCollection<PostViewModel>('posts');

	public async getAll(): Promise<PostViewModel[]> {
		return await this._collection.find({},{ projection: { _id: 0  }}).toArray();
	}

	public async getById(id: string): Promise<PostViewModel | null> {
		const post = await this._collection.findOne({ id },{ projection: { _id: 0  }});

		if (!post) {
			return null;
		}

		return post;
	}
}
