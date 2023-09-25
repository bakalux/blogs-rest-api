export interface PostInputModel {
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
	createdAt: string;
}

export interface PostViewModel extends PostInputModel {
	id: string;
}
