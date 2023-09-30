import { Filter, Sort } from "mongodb";

import { BlogViewModel } from './blogs-model';
import { IQueryRepository, QueryOptions, SortDirection } from '../../common/iquery-repository';
import { getCollection } from "../../db";
import { getSkip } from "../../common/utils";
import { PostViewModel } from '../posts/posts-model';

export class BlogsQueryRepository implements IQueryRepository<BlogViewModel> {
	private _blogsCollection = getCollection<BlogViewModel>('blogs');
	private _postsCollection = getCollection<PostViewModel>('posts');

	public async getAll(options: Partial<QueryOptions>): Promise<BlogViewModel[]> {
		const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = options;

		const filter: Filter<BlogViewModel> = {};

		if (searchNameTerm) {
			filter.name = { $regex: searchNameTerm };
		}

		const sorting: Sort = {}
		const sortField = sortBy ? sortBy : 'createdAt';
		sorting[sortField] = sortDirection === SortDirection.Desc ? -1 : 1;

		return await this._blogsCollection
			.find(filter, { projection: { _id: 0 } })
			.sort(sorting)
			.skip(getSkip(pageNumber, pageSize))
			.limit(pageSize)
			.toArray();
	}

	public async getById(id: string): Promise<BlogViewModel | null> {
		const blog = await this._blogsCollection.findOne({ id }, { projection: { _id: 0 } });
		if (!blog) {
			return null;
		}

		return blog;
	}

	public async getBlogPosts(blogId: string): Promise<PostViewModel[] | null> {
		const blog = await this._blogsCollection.findOne({ id: blogId }, { projection: { _id: 0 } });

		if (!blog) {
			return null;
		}

		return this._postsCollection.find({ blogId }, { projection: { _id: 0 } }).toArray();
	}
}
