import { Filter, Sort } from "mongodb";

import { PostViewModel } from './posts-model';
import { IQueryRepository, QueryOptions, SortDirection }  from '../../common/iquery-repository';
import { getCollection } from "../../db";
import { getSkip } from "../../common/utils";

export class PostsQueryRepository implements  IQueryRepository<PostViewModel>{
	private _collection = getCollection<PostViewModel>('posts');

	public async getAll(options: Partial<QueryOptions>): Promise<PostViewModel[]> {
		const { pageNumber, pageSize, sortBy, sortDirection } = options;

		const filter: Filter<PostViewModel> = {};

		const sorting: Sort = {}
		const sortField = sortBy ? sortBy : 'createdAt';
		sorting[sortField] = sortDirection === SortDirection.Desc ? -1 : 1;

		return await this._collection
			.find(filter, { projection: {_id: 0 } })
			.sort(sorting)
			.skip(getSkip(pageNumber, pageSize))
			.limit(pageSize)
			.toArray();
	}

	public async getById(id: string): Promise<PostViewModel | null> {
		const post = await this._collection.findOne({ id },{ projection: { _id: 0  }});

		if (!post) {
			return null;
		}

		return post;
	}
}
