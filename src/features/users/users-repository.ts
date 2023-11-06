import { getCollection } from '../../db';
import { UserDbModel, UserDbUpdateModel, UserDbViewModel } from './users-model';

export class UsersRepository {
	private _collection = getCollection<UserDbModel>('users');

	public async create(data: UserDbModel): Promise<UserDbViewModel> {
		await this._collection.insertOne({ ...data });

		const created = await this._collection.findOne({
			id: data.id,
		}, {
			projection: {
				_id: 0,
				password: 0
			}
		});

		if (created === null) {
			throw new Error("created user not found");
		}

		return created;
	}

	public async updateById(id: string, data: UserDbUpdateModel): Promise<UserDbViewModel | null> {
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

	public async updateConfirmationDataByUserId(userId: string, isConfirmed: boolean, code?: string): Promise<boolean> {
		const result = await this._collection.updateOne(
			{id: userId},
			{$set: {
					confirmationCode: code,
					isConfirmed,
				}
			},
		);

		return result.matchedCount !== 0;
	}

	public async updateTokenBlacklist(userId: string, blacklist: string[]): Promise<boolean> {
		const result = await this._collection.updateOne(
			{id: userId},
			{$set: {
					tokenBlacklist: blacklist,
				}
			},
		);

		return result.matchedCount !== 0;
	}
}
