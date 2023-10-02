import { Sort } from "mongodb";

import { PostDbModel, PostViewModel } from './posts-model';
import { ItemsQueryView, QueryOptions, SortDirection } from '../../common/query-options';
import { getCollection } from "../../db";
import { getSkip } from "../../common/utils";

export class PostsQueryRepository {
	private _collection = getCollection<PostDbModel>('posts');

	public async getAll(options: Partial<QueryOptions>): Promise<ItemsQueryView<PostViewModel>> {
		const { pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = SortDirection.Desc } = options;

		const sorting: Sort = {}
		sorting[sortBy] = sortDirection === SortDirection.Desc ? -1 : 1;

		const totalCount = await this._collection.countDocuments({});
		const pagesCount = Math.ceil(totalCount / pageSize);

		const items =  await this._collection
			.find({}, { projection: { _id: 0 } })
			.sort(sorting)
			.skip(getSkip(pageNumber, pageSize))
			.limit(pageSize)
			.toArray();

		return {
			totalCount,
			pagesCount,
			page: pageNumber,
			pageSize,
			items
		};
	}

	public async getById(id: string): Promise<PostViewModel | null> {
		const post = await this._collection.findOne({ id },{ projection: { _id: 0  }});

		if (!post) {
			return null;
		}

		return post;
	}
}
