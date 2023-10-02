import request from 'supertest';

import { UserInputModel, UserViewModel } from '../src/features/users/users-model';
import { usersTestManager } from './users-test-manager';
import { closeDbConnection, runDb } from '../src/db';
import { app } from '../src/app';
import { server } from './server';
import { AUTHORIZATION_TOKEN } from './consts';


let postedUser1: UserViewModel;
let postedUser2: UserViewModel;

beforeAll(async () => {
	await runDb();
	await request(app).delete('/testing/all-data')
		.expect(204)

	const input1: UserInputModel = {
		login: 'user1',
		password: '123546367',
		email: 'user1@gmail.com',
	}
	const res1 = await usersTestManager.createUser(input1, 201);
	postedUser1 = res1.body;

	const input2: UserInputModel = {
		login: 'user2',
		password: '123634576465',
		email: 'user2@yandex.ru',
	}
	const res2 = await usersTestManager.createUser(input2, 201);
	postedUser2 = res2.body;
})

afterAll(async () => {
	await closeDbConnection();
	server.close();
});

it('should return 200 with correct users', async () => {
	const res = await request(app).get('/users')
		.set('Authorization', AUTHORIZATION_TOKEN)
		.expect(200);

	expect(res.body).toEqual({
		totalCount: 2,
		pagesCount: 1,
		page: 1,
		pageSize: 10,
		items: [postedUser2, postedUser1]
	})
});

it('should correctly return number of items according to pageSize and pageNumber', async () => {
	const res = await request(app).get('/users/?pageSize=1&pageNumber=2')
		.expect(200);

	expect(res.body).toEqual({
		totalCount: 2,
		pagesCount: 2,
		page: 2,
		pageSize: 1,
		items: [postedUser1],
	});
});

it('should correctly return search items by searchLoginTerm', async () => {
	const res = await request(app).get('/users/?searchLoginTerm=user1')
		.expect(200);

	expect(res.body).toEqual({
		totalCount: 1,
		pagesCount: 1,
		page: 1,
		pageSize: 10,
		items: [postedUser1]
	});
});

it('should correctly return search items by searchEmailTerm', async () => {
	const res = await request(app).get('/users/?searchEmailTerm=yandex')
		.expect(200);

	expect(res.body).toEqual({
		totalCount: 1,
		pagesCount: 1,
		page: 1,
		pageSize: 10,
		items: [postedUser2]
	});
});

it('should correctly handle sorting direction', async () => {
	const res1 = await request(app).get('/users/?sortDirection=desc')
		.expect(200);

	expect(res1.body).toEqual({
		totalCount: 2,
		pagesCount: 1,
		page: 1,
		pageSize: 10,
		items: [postedUser2, postedUser1]
	});

	const res2 = await request(app).get('/users/?sortDirection=asc')
		.expect(200);

	expect(res2.body).toEqual({
		totalCount: 2,
		pagesCount: 1,
		page: 1,
		pageSize: 10,
		items: [postedUser1, postedUser2]
	});
});

it('should correctly sort by sortBy field', async () => {
	const res = await request(app).get('/users/?sortBy=login')
		.expect(200);

	expect(res.body).toEqual({
		totalCount: 2,
		pagesCount: 1,
		page: 1,
		pageSize: 10,
		items: [postedUser2, postedUser1]
	});
});


// it('should return 200 with correct user', async () => {
// 	await request(app).get(`/users/${ postedUser1.id }`)
// 		.set('Authorization', AUTHORIZATION_TOKEN)
// });

it('should not return user by id and return 401 unauthorized', async () => {
	await request(app).get(`/users/${ postedUser1.id }`)
});

it('should not get user and return 404', async () => {
	await request(app).get('/users/asdfasdfasdf4352345')
		.set('Authorization', AUTHORIZATION_TOKEN)
		.expect(404)
})

it('should create new user with correct data and return created user', async () => {
	const input: UserInputModel = {
		login: 'loigin',
		password: '1233456346',
		email: 'login@gmail.com',
	};

	await usersTestManager.createUser(input, 201);
})

it('should not create new user and return validation errors', async () => {
	const wrongData = {
		login: 4124312,
		email: 'kek.com',
		password: [],
	}

	const res = await usersTestManager.createUser(wrongData as unknown as UserInputModel, 400);

	expect(res.body).toEqual({
		errorsMessages: [
			{
				message: expect.any(String),
				field: 'login'
			},
			{
				message: expect.any(String),
				field: 'email'
			},
			{
				message: expect.any(String),
				field: 'password'
			},
		]
	});
})

it('should not create user and return 401 unauthorized', async () => {
		const input: UserInputModel = {
		login: 'qwerty',
		password: '123745674567456',
		email: 'qwerty@gmail.com',
	};

	await usersTestManager.createUserUnauthorized(input);
})


it('should not create user that already exists', async () => {
	const res = await request(app).put(`/users/${ postedUser2.id }`)
		.set('Authorization', AUTHORIZATION_TOKEN)
		.send({
			login: postedUser1.login,
			password: 'rt34563y4y234125243',
			email: postedUser1.email,
		})
		.expect(400);

	expect(res.body).toEqual({
		errorsMessages: [
			{
				message: expect.any(String),
				field: 'login'
			},
			{
				message: expect.any(String),
				field: 'email'
			},
		]
	});
});

it('should update user and return 204 with no content', async () => {
	const input: UserInputModel = {
		login: 'loigin435345',
		password: '123745674567456',
		email: 'login4352345@gmail.com',
	};

	await request(app).put(`/users/${ postedUser2.id }`)
		.set('Authorization', AUTHORIZATION_TOKEN)
		.send(input)
		.expect(204)
})

it('should not update user and return 400 with validation errors', async () => {
	const res = await request(app).put(`/users/${ postedUser2.id }`)
		.set('Authorization', AUTHORIZATION_TOKEN)
		.send({
			login: '',
			password: '                    ',
			email: '            ',
		})
		.expect(400);

	expect(res.body).toEqual({
		errorsMessages: [
			{
				message: expect.any(String),
				field: 'login'
			},
			{
				message: expect.any(String),
				field: 'password'
			},
			{
				message: expect.any(String),
				field: 'email'
			},
		]
	});
});

it('should not update user and return 401 unauthorized', async () => {
	const input: UserInputModel = {
		login: 'user3241235',
		password: '1234567',
		email: 'usdfe@gmail.com',
	};

	await request(app).put(`/users/${ postedUser2.id }`)
		.send(input)
		.expect(401)
})

it('should not update user and return 404', async () => {
	const input: UserInputModel = {
		login: 'user324123533',
		password: '1234567',
		email: 'usdfe@gmail.com',
	};

	await request(app).put('/users/asdfasdfasdf4352345')
		.set('Authorization', AUTHORIZATION_TOKEN)
		.send(input)
		.expect(404)
})

it('should delete user and return 204 no content', async () => {
	await request(app).delete(`/users/${ postedUser2.id }`)
		.set('Authorization', AUTHORIZATION_TOKEN)
		.expect(204)
})

it('should not delete user and return 404', async () => {
	await request(app).delete('/users/asdfasdfasdf4352345')
		.set('Authorization', AUTHORIZATION_TOKEN)
		.expect(404)
})

it('should delete all data and return 204', async () => {
	await request(app).delete('/testing/all-data')
		.expect(204, {})
})
