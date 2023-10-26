export interface CommentInputModel {
	content: string;
}

interface CommentatorInfo {
    userId: string;
    userLogin: string;
}

export interface CommentViewModel {
	id: string;
	content: string;
	commentatorInfo: CommentatorInfo;
	createdAt: string;
}

export interface CommentDbUpdateModel {
	content: string;
}

export interface CommentDbModel {
    id: string;
	content: string;
	commentatorInfo: CommentatorInfo;
	createdAt: string;
}
