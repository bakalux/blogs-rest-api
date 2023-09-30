import { Filter, Sort } from "mongodb";

import { BlogViewModel } from './blogs-model';
import { IQueryRepository, ItemsQueryView, QueryOptions, SortDirection } from '../../common/iquery-repository';
import { getCollection } from "../../db";
import { getSkip } from "../../common/utils";
import { PostViewModel } from '../posts/posts-model';

export class BlogsQueryRepository implements IQueryRepository<BlogViewModel> {
	private _blogsCollection = getCollection<BlogViewModel>('blogs');
	private _postsCollection = getCollection<PostViewModel>('posts');

	public async getAll(options: Partial<QueryOptions>): Promise<ItemsQueryView<BlogViewModel>> {
		const { pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = SortDirection.Desc, searchNameTerm } = options;

		const filter: Filter<BlogViewModel> = {};

		if (searchNameTerm) {
			filter.name = { $regex: searchNameTerm };
		}

		const sorting: Sort = {}
		sorting[sortBy] = sortDirection === SortDirection.Desc ? -1 : 1;

		const totalCount = await this._blogsCollection.countDocuments(filter);
		const pagesCount = Math.ceil(totalCount / pageSize);

		const items = await this._blogsCollection
			.find(filter, { projection: { _id: 0 } })
			.sort(sorting)
			.skip(getSkip(pageNumber, pageSize))
			.limit(pageSize)
			.toArray();

		return {
			totalCount,
			pageSize,
			page: pageNumber,
			pagesCount,
			items,
		}
	}

	public async getById(id: string): Promise<BlogViewModel | null> {
		const blog = await this._blogsCollection.findOne({ id }, { projection: { _id: 0 } });
		if (!blog) {
			return null;
		}

		return blog;
	}

	public async getBlogPosts(blogId: string, options: Partial<QueryOptions>): Promise<ItemsQueryView<PostViewModel> | null> {
		const blog = await this._blogsCollection.findOne({ id: blogId }, { projection: { _id: 0 } });

		if (!blog) {
			return null;
		}

		const filter = { blogId };
		const { pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = SortDirection.Desc } = options;
		const sorting: Sort = {}
		sorting[sortBy] = sortDirection === SortDirection.Desc ? -1 : 1;

		const totalCount = await this._postsCollection.countDocuments(filter);
		const pagesCount = Math.ceil(totalCount / pageSize);

		const items = await this._postsCollection
			.find(filter, { projection: { _id: 0 } })
			.sort(sorting)
			.skip(getSkip(pageNumber, pageSize))
			.limit(pageSize)
			.toArray();

		return {
			totalCount,
			pageSize,
			page: pageNumber,
			pagesCount,
			items,
		};
	}
}
