export interface BlogInputModel {
	name: string;
	description: string;
	websiteUrl: string;
}

export interface BlogViewModel extends BlogInputModel {
	id: string;
	isMembership: boolean;
	createdAt: string
}

export interface BlogPostInputModel {
	title: string;
	shortDescription: string;
	content: string;
}
