export interface BlogInputModel {
	name: string;
	description: string;
	websiteUrl: string;
}

export interface BlogViewModel extends BlogInputModel {
	id: string;
}
