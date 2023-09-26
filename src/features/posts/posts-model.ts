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
