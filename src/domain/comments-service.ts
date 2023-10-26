import {CommentDbModel, CommentInputModel, CommentViewModel} from "../features/comments/comments-model";
import { CommentsRepository } from "../features/comments/comments-repository";
import {UsersQueryRepository} from "../features/users/users-query-repository";


interface CommentInputData extends CommentInputModel {
    postId: string;
    userId: string;
}
export class CommentsService {
	private _commentsRepository = new CommentsRepository();
    private _usersQueryRepository = new UsersQueryRepository();


	public async create(data: CommentInputData): Promise<CommentViewModel> {
		const user = await this._usersQueryRepository.getById(data.userId);

		if (user === null) {
			throw new Error("No such user");
		}

		const date = new Date();
		const comment: CommentDbModel = {
			content: data.content,
			id: Math.floor(Math.random() * 1000).toString(),
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
			createdAt: date.toISOString(),
		};

		return this._commentsRepository.create(comment);
	}

	public async updateById(id: string, data: CommentInputModel): Promise<CommentViewModel | null> {
		return await this._commentsRepository.updateById(id, data);
	}

	public async deleteById(id: string): Promise<boolean> {
		return this._commentsRepository.deleteById(id);
	}

	public async deleteAll(): Promise<void> {
		await this._commentsRepository.deleteAll();
	}
}
