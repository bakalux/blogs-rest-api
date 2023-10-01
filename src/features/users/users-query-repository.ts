import { IQueryRepository, ItemsQueryView, QueryOptions, SortDirection } from '../../common/iquery-repository';
import { getCollection } from '../../db';
import { UserViewModel } from './users-model';
import { Filter, Sort } from 'mongodb';
import { BlogViewModel } from '../blogs/blogs-model';
import { getSkip } from '../../common/utils';

interface UsersQueryOptions extends QueryOptions {
	searchLoginTerm: string;
	searchEmailTerm: string;
}

export class UsersQueryRepository implements  IQueryRepository<UserViewModel> {
	private _collection = getCollection<UserViewModel>('users');

	public async getAll(options: Partial<UsersQueryOptions>): Promise<ItemsQueryView<UserViewModel>> {
		const { pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = SortDirection.Desc, searchLoginTerm, searchEmailTerm } = options;

		const filter: Filter<BlogViewModel> = {};

		if (searchLoginTerm) {
			filter.login = { $regex: searchLoginTerm, $options: 'i' };
		}

		if (searchEmailTerm) {
			filter.email = { $regex: searchEmailTerm, $options: 'i' };
		}

		const sorting: Sort = {}
		sorting[sortBy] = sortDirection === SortDirection.Desc ? -1 : 1;

		const totalCount = await this._collection.countDocuments(filter);
		const pagesCount = Math.ceil(totalCount / pageSize);

		const items = await this._collection
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

	public async getById(id: string): Promise<UserViewModel | null> {
		throw new Error("not implemented");
	}
}
