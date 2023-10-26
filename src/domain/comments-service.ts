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
			postId: data.postId,
			content: data.content,
			id: Math.floor(Math.random() * 1000).toString(),
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
			createdAt: date.toISOString(),
		};

		const created = await this._commentsRepository.create(comment);

		return {
			id: created.id,
			content: created.content,
			createdAt: created.createdAt,
			commentatorInfo: created.commentatorInfo,
		}
	}

	public async updateById(id: string, data: CommentInputModel): Promise<CommentViewModel | null> {
		const updated = await this._commentsRepository.updateById(id, data);

		if (updated === null) {
			return null;
		}

		return {
			id: updated.id,
			content: updated.content,
			createdAt: updated.createdAt,
			commentatorInfo: updated.commentatorInfo,
		}
	}

	public async deleteById(id: string): Promise<boolean> {
		return this._commentsRepository.deleteById(id);
	}

	public async deleteAll(): Promise<void> {
		await this._commentsRepository.deleteAll();
	}
}
