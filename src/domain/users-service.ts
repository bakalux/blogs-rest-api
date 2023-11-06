import {randomUUID} from "node:crypto";
import { compare, genSalt, hash } from 'bcrypt';

import { UserDbModel, UserInputModel, UserViewModel } from '../features/users/users-model';
import { UsersRepository } from '../features/users/users-repository';
import { LoginInputModel } from '../features/auth/auth-model';
import { UsersQueryRepository } from '../features/users/users-query-repository';
import {emailManager} from "../managers/email-manager";


export class UsersService {
	private _usersRepository = new UsersRepository();
	private _usersQueryRepository = new UsersQueryRepository();

	public async create(data: UserInputModel, forceConfirm: boolean): Promise<UserViewModel> {
		const passwordHash = await this._generatePasswordHash(data.password);
		const date = new Date();
		const confirmationCode = forceConfirm ? undefined : randomUUID();
		const user: UserDbModel = {
			login: data.login,
			email: data.email,
			password: passwordHash,
			id: randomUUID(),
			createdAt: date.toISOString(),
			isConfirmed: forceConfirm,
			tokenBlacklist: [],
			confirmationCode,
		};

		if (!forceConfirm) {
			await emailManager.sendEmail(
				'Blogs App', data.email,
				'Email confirmation',
				`
						<h1>Thank for your registration</h1>
						 <p>To finish registration please follow the link below:
							 <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
						 </p>
					`
			);
		}

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

	public async confirmUser(confirmationCode: string): Promise<boolean> {
		const user = await this._usersQueryRepository.getByConfirmationCode(confirmationCode);

		if (!user || user.isConfirmed) {
			return false;
		}

		const updated = await this._usersRepository.updateConfirmationDataByUserId(user.id, true, undefined);

		return updated;
	}

	public async resendConfirmation(email: string): Promise<boolean> {
		const user = await this._usersQueryRepository.getByEmail(email);

		if (user === null || user.isConfirmed) {
			return false;
		}

		const code = randomUUID();
		const updated = await this._usersRepository.updateConfirmationDataByUserId(user.id, false, code);

		if (!updated) {
			return false;
		}

		await emailManager.sendEmail(
				'Blogs App', email,
				'Email confirmation resending',
				`
						<h1>Email confirmation resending</h1>
						 <p>To finish registration please follow the link below:
							 <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
						 </p>
					`
			);

		return true;
	}

	public async updateTokenBlacklist(userId: string, blacklist: string[]): Promise<boolean> {
		return this._usersRepository.updateTokenBlacklist(userId, blacklist)
	}

	private async _generatePasswordHash(password: string): Promise<string> {
		const salt = await genSalt(10);
		return hash(password, salt)
	}

	private async _comparePasswords(password: string, hash: string): Promise<boolean> {
		return compare(password, hash);
	}
}

