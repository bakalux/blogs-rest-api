import { BlogViewModel } from './blogs-model';
import { IQueryRepository, QueryOptions, SortDirection } from '../../common/iquery-repository';
import { getCollection } from "../../db";
import { getSkip } from "../../common/utils";
import { Filter, Sort } from "mongodb";

export class BlogsQueryRepository implements IQueryRepository<BlogViewModel> {
	private _collection = getCollection<BlogViewModel>('blogs');

	public async getAll(options: Partial<QueryOptions>): Promise<BlogViewModel[]> {
		const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = options;

		const filter: Filter<BlogViewModel> = {};

		if (searchNameTerm) {
			filter.name = { $regex: searchNameTerm };
		}

		const sorting: Sort = {}
		if (sortBy) {
			sorting[sortBy] = sortDirection === SortDirection.Desc ? -1 : 1;
		}


		return await this._collection
			.find(filter, { projection: { _id: 0 } })
			.sort(sorting)
			.skip(getSkip(pageNumber, pageSize))
			.toArray();
	}

	public async getById(id: string): Promise<BlogViewModel | null> {
		const blog = await this._collection.findOne({ id }, { projection: { _id: 0 } });
		if (!blog) {
			return null;
		}

		return blog;
	}
}
