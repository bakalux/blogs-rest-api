export interface PostInputModel {
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName?: string;
}

export interface PostViewModel extends PostInputModel {
	id: string;
}
