export interface UserInputModel {
	login: string;
	password: string;
	email: string;
}

export interface UserViewModel {
	id: string;
	login: string;
	email: string;
	createdAt: string;
}

export interface UserDbModel {
	id: string;
	login: string;
	email: string;
	createdAt: string;
	// hashed password
	password: string;
	isConfirmed: boolean;
	confirmationCode?: string;
}

export interface UserDbUpdateModel {
	login: string;
	password: string;
	email: string;
	isConfirmed?: boolean;
	confirmationCode?: string;
	createdAt: string;
}

export interface UserDbViewModel {
	id: string;
	login: string;
	email: string;
	createdAt: string;
	isConfirmed: boolean;
	confirmationCode?: string;
}

