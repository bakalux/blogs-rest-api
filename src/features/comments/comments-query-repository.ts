import {Filter, Sort} from "mongodb";

import { CommentDbModel, CommentViewModel } from './comments-model';
import { ItemsQueryView, QueryOptions, SortDirection } from '../../common/query-options';
import { getCollection } from "../../db";
import { getSkip } from "../../common/utils";

export class CommentsQueryRepository {
	private _collection = getCollection<CommentDbModel>('comments');

	public async getAllByPostId(id: string, options: Partial<QueryOptions>): Promise<ItemsQueryView<CommentViewModel>> {
		const { pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = SortDirection.Desc } = options;

		const sorting: Sort = {}
		sorting[sortBy] = sortDirection === SortDirection.Desc ? -1 : 1;
		const filter: Filter<CommentDbModel> = {
			postId: id,
		};

		const totalCount = await this._collection.countDocuments(filter);
		const pagesCount = Math.ceil(totalCount / pageSize);

		const items =  await this._collection
			.find(filter, { projection: {
				_id: 0,
				postId: 0,
			} })
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

	public async getById(id: string): Promise<CommentViewModel | null> {
		const comment = await this._collection.findOne({ id },{ projection: { _id: 0, postId: 0 }});

		if (!comment) {
			return null;
		}

		return comment;
	}
}
