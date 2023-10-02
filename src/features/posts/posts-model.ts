export interface PostInputModel {
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
}

export interface PostViewModel extends PostInputModel {
	id: string;
	blogName: string;
	createdAt: string;
}

export interface PostDbUpdateModel {
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
}

export interface PostDbModel {
	id: string;
	blogName: string;
	createdAt: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
}

export interface PostDbViewModel {
	id: string;
	blogName: string;
	createdAt: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
}
