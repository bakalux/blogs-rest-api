import {randomUUID} from "node:crypto";
import { compare, genSalt, hash } from 'bcrypt';

import { IService } from './iservice';
import { UserDbModel, UserInputModel, UserViewModel } from '../features/users/users-model';
import { UsersRepository } from '../features/users/users-repository';
import { LoginInputModel } from '../features/auth/auth-model';
import { UsersQueryRepository } from '../features/users/users-query-repository';


export class UsersService {
	private _usersRepository = new UsersRepository();
	private _usersQueryRepository = new UsersQueryRepository();

	public async create(data: UserInputModel, isConfirmed: boolean): Promise<UserViewModel> {
		const passwordHash = await this._generatePasswordHash(data.password);
		const date = new Date();
		const user: UserDbModel = {
			login: data.login,
			email: data.email,
			password: passwordHash,
			id: randomUUID(),
			createdAt: date.toISOString(),
			isConfirmed,
		};

		return this._usersRepository.create(user);
	}

	public async updateById(id: string, data: UserInputModel): Promise<UserViewModel | null> {
		throw new Error("not implemented");
	}

	public async deleteById(id: string): Promise<boolean> {
		return this._usersRepository.deleteById(id);
	}

	public async deleteAll(): Promise<void> {
		await this._usersRepository.deleteAll();
	}

	public async checkCredentials(credentials: LoginInputModel): Promise<string | null> {
		const { loginOrEmail, password } = credentials;

		const user = await this._usersQueryRepository.getAuthData(loginOrEmail);

		if (!user || !user.isConfirmed) {
			return null;
		}

		const arePasswordsEqual = await this._comparePasswords(password, user.password);

		return arePasswordsEqual ? user.id : null;
	}

	private async _generatePasswordHash(password: string): Promise<string> {
		const salt = await genSalt(10);
		return hash(password, salt)
	}

	private async _comparePasswords(password: string, hash: string): Promise<boolean> {
		return compare(password, hash);
	}
}

