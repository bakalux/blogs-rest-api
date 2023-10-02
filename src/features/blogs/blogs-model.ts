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

export interface BlogDbModel {
	name: string;
	description: string;
	websiteUrl: string;
	id: string;
	isMembership: boolean;
	createdAt: string
}

export interface BlogDbUpdateModel {
	name: string;
	description: string;
	websiteUrl: string;
}

export interface BlogDbViewModel {
	name: string;
	description: string;
	websiteUrl: string;
	id: string;
	isMembership: boolean;
	createdAt: string
}
