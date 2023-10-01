import { IRepository } from '../../common/irepository';
import { getCollection } from '../../db';
import { UserInputModel, UserViewModel } from './users-model';

// TODO: use repository class for all repositories
export class UsersRepository implements  IRepository<UserViewModel, UserInputModel>{
	private _collection = getCollection<UserViewModel>('users');

	public async create(data: UserViewModel): Promise<UserViewModel> {
		await this._collection.insertOne({ ...data });

		return data;
	}

	public async updateById(id: string, data: UserInputModel): Promise<UserViewModel | null> {
		const updating = {
			...data,
			id
		}
		const result = await this._collection.updateOne(
			{ id },
			{ $set: updating },
		);

		if (result.matchedCount === 0) {
			return null;
		}

		const updated = await this._collection.findOne({ id }, { projection: { _id: 0  }});

		return updated;
	}

	public async deleteById(id: string): Promise<boolean> {
		const result = await this._collection.deleteOne({ id });

		return result.deletedCount !== 0;
	}

	public async deleteAll(): Promise<void> {
		await this._collection.deleteMany({});
	}
}
