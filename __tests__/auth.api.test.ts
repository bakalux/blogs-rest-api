import request from 'supertest';

import { closeDbConnection, runDb } from '../src/db';
import { app } from '../src/app';
import { server } from './server';
import { UserInputModel, UserViewModel } from '../src/features/users/users-model';
import { usersTestManager } from './users-test-manager';

describe('/auth', () => {
	let postedUser1: UserViewModel;
	const input1: UserInputModel = {
		login: 'user1',
		password: '123546367',
		email: 'user1@gmail.com',
	}

	let accessToken: string = 'placeholder';

	beforeAll(async () => {
		await runDb();
		await request(app).delete('/testing/all-data')
			.expect(204)
		const res1 = await usersTestManager.createUser(input1, 201);
		postedUser1 = res1.body;
	})

	afterAll(async () => {
		await request(app).delete('/testing/all-data')
			.expect(204)
		await closeDbConnection();
		server.close();
	});

	it('should auth user by login and return 200 with accessToken', async () => {
		const res = await request(app).post('/auth/login')
			.send({
				loginOrEmail: postedUser1.login,
				password: input1.password,
			}).expect(200);

		expect(res.body).toEqual({
			accessToken: expect.any(String),
		});

		accessToken = res.body.accessToken;
	});

	it('should auth user by email and return 200 with access token', async () => {
		const res = await request(app).post('/auth/login')
			.send({
				loginOrEmail: postedUser1.email,
				password: input1.password,
			}).expect(200)

		expect(res.body).toEqual({
			accessToken: expect.any(String),
		});

		accessToken = res.body.accessToken;
	});

	it('should not auth user and return validation errors', async () => {
		const res = await request(app).post('/auth/login')
			.send({
				loginOrEmail: '',
				password: '',
			});

		expect(res.body).toEqual({
			errorsMessages: [
				{
					message: expect.any(String),
					field: 'loginOrEmail'
				},
				{
					message: expect.any(String),
					field: 'password'
				},
			]
		});
	});

	it('should not find user by login return 401 unauthorized', async () => {
		await request(app).post('/auth/login')
			.send({
				loginOrEmail: 'asdfasdf',
				password: '1234567',
			}).expect(401);
	});

	it('should not find user by email return 401 unauthorized', async () => {
		await request(app).post('/auth/login')
			.send({
				loginOrEmail: 'random@gmail.com',
				password: '1234567',
			}).expect(401);
	});

	it('should not auth user with wrong password return 401 unauthorized', async () => {
		await request(app).post('/auth/login')
			.send({
				loginOrEmail: postedUser1.login,
				password: '123456',
			})
			.expect(401);
	});

	it('should return user data on auth me with correct access token', async () => {
		const authToken = 'Bearer ' + Buffer.from(accessToken).toString('base64');

		const res = await request(app).get('/auth/me')
			.set('Authorization', authToken)
			.expect(200);

		expect(res.body).toEqual({
			email: postedUser1.email,
			login: postedUser1.login,
			userId: postedUser1.id,
		});
	});

	it('should not return user data on auth/me with wrong access token and return 401 ', async () => {
		await request(app).get('/auth/me')
			.set('Authorization', 'Bearer blabalblalb')
			.expect(401);
	});
})
