import { IService } from './iservice';
import { UserInputModel, UserViewModel } from '../features/users/users-model';
import { UsersRepository } from '../features/users/users-repository';


export class UsersService implements IService<UserViewModel, UserInputModel>{
    private _usersRepository = new UsersRepository();

    public async create(data: UserInputModel): Promise<UserViewModel> {
        const date = new Date();
        const user: UserViewModel = {
			login: data.login,
			email: data.email,
            id: Math.floor(Math.random() * 1000).toString(),
            createdAt: date.toISOString(),
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
}

