import { ItemsQueryView, QueryOptions, SortDirection } from '../../common/query-options';
import { getCollection } from '../../db';
import {UserDbModel, UserViewModel} from './users-model';
import { Filter, Sort } from 'mongodb';
import { getSkip } from '../../common/utils';

interface UsersQueryOptions extends QueryOptions {
	searchLoginTerm: string;
	searchEmailTerm: string;
}

export class UsersQueryRepository {
	private _collection = getCollection<UserDbModel>('users');

	public async getAll(options: Partial<UsersQueryOptions>): Promise<ItemsQueryView<UserViewModel>> {
		const {
			pageNumber = 1,
			pageSize = 10,
			sortBy = 'createdAt',
			sortDirection = SortDirection.Desc,
			searchLoginTerm,
			searchEmailTerm
		} = options;

		const filter: Filter<UserDbModel> = {
			$or: [
				{
					login: {
						$regex: searchLoginTerm ?? '',
						$options: 'i'
					}
				},
				{email: {$regex: searchEmailTerm ?? '', $options: 'i'}}]
		};

		const sorting: Sort = {}
		sorting[sortBy] = sortDirection === SortDirection.Desc ? -1 : 1;

		const totalCount = await this._collection.countDocuments(filter);
		const pagesCount = Math.ceil(totalCount / pageSize);

		console.log('filter', filter);
		console.log('sorting', sorting);

		const items = await this._collection
			.find(filter, { projection: { _id: 0, password: 0 } })
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

	public async getByLogin(login: string): Promise<UserViewModel | null> {
		const user = await this._collection.findOne({ login }, { projection: { _id: 0, password: 0 } });

		if (!user) {
			return null;
		}

		return user;
	}

	public async getByEmail(email: string): Promise<UserViewModel | null> {
		const user = await this._collection.findOne({ email }, { projection: { _id: 0, password: 0 } });

		if (!user) {
			return null;
		}

		return user;
	}

	public async getById(id: string): Promise<UserViewModel | null> {
		const user = await this._collection.findOne({ id }, { projection: { _id: 0, password: 0 } });

		if (!user) {
			return null;
		}

		return user;
	}

	public async getAuthData(loginOrEmail: string): Promise<UserDbModel | null> {
		const user = await this._collection.findOne({
			$or: [{ email: loginOrEmail }, { login: loginOrEmail }]
		}, { projection: { _id: 0 } });

		if (!user) {
			return null;
		}

		return user;
	}
}
