export interface BlogInputModel {
	name: string;
	description: string;
	websiteUrl: string;
	isMembership: boolean;
	createdAt: string
}

export interface BlogViewModel extends BlogInputModel {
	id: string;
}
