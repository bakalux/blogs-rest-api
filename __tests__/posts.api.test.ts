import request from 'supertest';
import { app } from '../src/app';
import { PostInputModel, PostViewModel } from '../src/features/posts/posts-model';
import { postsTestManager } from './posts-test-manager';
import { blogsTestManager } from "./blogs-test-manager";
import { BlogInputModel, BlogViewModel } from "../src/features/blogs/blogs-model";
import { AUTHORIZATION_TOKEN } from "./consts";
import { server } from "./server";
import { runDb, closeDbConnection } from "../src/db";
import {UserInputModel, UserViewModel} from "../src/features/users/users-model";
import {usersTestManager} from "./users-test-manager";


type UnknownPostInputModel = {
	[K in keyof PostInputModel]: unknown;
}

describe('/posts', () => {
	let postedPost1: PostViewModel;
	let postedPost2: PostViewModel;
	let validInputData: PostInputModel;
	let bindingBlog: BlogViewModel;
	let postedUser1: UserViewModel;
	let accessToken = 'wrong token';
	beforeAll(async () => {
		await runDb();
		await request(app).delete('/testing/all-data')
			.expect(204)

		const blogInput: BlogInputModel = {
			name: 'mock blog',
			description: 'mock description',
			websiteUrl: 'https://vk.com',
		}
		const { body: blog } = await blogsTestManager.createBlog(blogInput, 201);

		bindingBlog = blog;

		validInputData = {
			title: 'valid name',
			shortDescription: 'valid description',
			content: 'https://valid.com',
			blogId: bindingBlog.id,
		}

		const input1: PostInputModel = {
			title: 'fancy valid title 1',
			shortDescription: 'some shortDescription 1',
			content: 'beta',
			blogId: bindingBlog.id,
		}

		const res1 = await postsTestManager.createPost(input1, 201, bindingBlog.name)
		postedPost1 = res1.body;

		const input2: PostInputModel = {
			title: 'super title 2',
			shortDescription: 'awesome shortDescription 2',
			content: 'giga',
			blogId: bindingBlog.id,
		}

		const res2 = await postsTestManager.createPost(input2, 201, bindingBlog.name)
		postedPost2 = res2.body;

		const userInput1: UserInputModel = {
			login: 'user1',
			password: '123546367',
			email: 'user1@gmail.com',
		}
		const userRes1 = await usersTestManager.createUser(userInput1, 201);
		postedUser1 = userRes1.body;

		const loginRes = await request(app).post('/auth/login')
			.send({
				loginOrEmail: postedUser1.login,
				password: userInput1.password,
			}).expect(200);

		expect(loginRes.body).toEqual({
			accessToken: expect.any(String),
		});

		accessToken = 'Bearer ' + Buffer.from(loginRes.body.accessToken).toString('base64');
	})

	afterAll(async () => {
		await closeDbConnection();
		server.close();
	});

	it('should return 200 with correct posts', async () => {
		const res = await request(app).get('/posts')
			.expect(200);

		expect(res.body).toEqual({
			totalCount: 2,
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			items: [postedPost2, postedPost1]
		})
	});


	it('should correctly return number of items according to pageSize and pageNumber', async () => {
		const res = await request(app).get('/posts/?pageSize=1&pageNumber=2')
			.expect(200);

		expect(res.body).toEqual({
			totalCount: 2,
			pagesCount: 2,
			page: 2,
			pageSize: 1,
			items: [postedPost1],
		});
	});

	it('should correctly handle sorting direction', async () => {
		const res1 = await request(app).get('/posts/?sortDirection=desc')
			.expect(200);

		expect(res1.body).toEqual({
			totalCount: 2,
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			items: [postedPost2, postedPost1]
		});

		const res2 = await request(app).get('/posts/?sortDirection=asc')
			.expect(200);

		expect(res2.body).toEqual({
			totalCount: 2,
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			items: [postedPost1, postedPost2]
		});
	});

	it('should correctly sort by sortBy field', async () => {
		const res = await request(app).get('/posts/?sortBy=shortDescription')
			.expect(200);

		expect(res.body).toEqual({
			totalCount: 2,
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			items: [postedPost1, postedPost2]
		});
	});

	it('should return 200 with correct post', async () => {
		await request(app).get(`/posts/${ postedPost1.id }`)
	});

	it('should not get post and return 404', async () => {
		await request(app).get('/posts/asdfasdfasdf4352345')
			.expect(404)
	})

	it('should create new post with correct data and return created post', async () => {
		const response = await postsTestManager.createPost(validInputData, 201, bindingBlog.name);

		expect(response.body).toEqual({
			id: expect.any(String),
			title: validInputData.title,
			shortDescription: validInputData.shortDescription,
			createdAt: expect.any(String),
			content: validInputData.content,
			blogId: bindingBlog.id,
			blogName: bindingBlog.name,
		});
	})

	it('should not create new post and return validation errors', async () => {
		const wrongData: UnknownPostInputModel = {
			title: '            ',
			shortDescription: '',
			content: '               ',
			blogId: false,
		}

		const res = await postsTestManager.createPost(wrongData as PostInputModel, 400);

		expect(res.body).toEqual({
			errorsMessages: [
				{
					message: expect.any(String),
					field: 'title'
				},
				{
					message: expect.any(String),
					field: 'shortDescription'
				},
				{
					message: expect.any(String),
					field: 'content'
				},
				{
					message: expect.any(String),
					field: 'blogId'
				},
			]
		});
	})

	it('should not create post and return 401 unauthorized', async () => {
		await postsTestManager.createPostUnauthorized(validInputData);
	})

	it('should update post and return 204 with no content', async () => {
		await request(app).put(`/posts/${ postedPost2.id }`)
			.set('Authorization', AUTHORIZATION_TOKEN)
			.send(validInputData)
			.expect(204)

		const res = await request(app).get(`/posts/${ postedPost2.id }`)
			.expect(200)

		expect(res.body).toEqual({
			...validInputData,
			blogName: bindingBlog.name,
			createdAt: expect.any(String),
			id: expect.any(String),
		});
	})

	it('should not update post and return 400 with validation errors', async () => {
		const res = await request(app).put(`/posts/${ postedPost2.id }`)
			.set('Authorization', AUTHORIZATION_TOKEN)
			.send({
				blogId: '',
				title: '          ',
				shortDescription: '      ',
				content: '            ',
			})
			.expect(400);

		expect(res.body).toEqual({
			errorsMessages: [
				{
					message: expect.any(String),
					field: 'title'
				},
				{
					message: expect.any(String),
					field: 'shortDescription'
				},
				{
					message: expect.any(String),
					field: 'content'
				},
				{
					message: expect.any(String),
					field: 'blogId'
				},
			]
		});
	});

	it('should not update post and return 401 unauthorized', async () => {
		await request(app).put(`/posts/${ postedPost2.id }`)
			.send(validInputData)
			.expect(401)
	})

	it('should not update post and return 404', async () => {
		await request(app).put('/posts/asdfasdfasdf4352345')
			.set('Authorization', AUTHORIZATION_TOKEN)
			.send(validInputData)
			.expect(404)
	})

	it('should create comment for existing post', async () => {
		const data = {
			content: 'some random comment should be valid enough'
		}
		const res = await request(app).post(`/posts/${postedPost1.id}/comments`)
			.set('Authorization', accessToken)
			.send({
				content: 'some random comment should be valid enough'
			})
			.expect(201)

		expect(res.body).toEqual({
			id: expect.any(String),
			createdAt: expect.any(String),
			content: data.content,
			commentatorInfo: {
				userId: postedUser1.id,
				userLogin: postedUser1.login,
			}
		});
	});

	it('should return comments for existing post', async () => {
		const res = await request(app).get(`/posts/${postedPost1.id}/comments`)
			.expect(200)

		expect(res.body).toEqual({
				totalCount: 1,
				pagesCount: 1,
				page: 1,
				pageSize: 10,
				items: [{
					id: expect.any(String),
					createdAt: expect.any(String),
					content: expect.any(String),
					commentatorInfo: {
						userId: postedUser1.id,
						userLogin: postedUser1.login,
					}
				}]
			}
		);
	})

	it('should delete post and return 204 no content', async () => {
		await request(app).delete(`/posts/${ postedPost2.id }`)
			.set('Authorization', AUTHORIZATION_TOKEN)
			.expect(204)

		await request(app).get(`/posts/${ postedPost2.id }`)
			.expect(404)
	})

	it('should not delete post and return 404', async () => {
		await request(app).delete('/posts/asdfasdfasdf4352345')
			.set('Authorization', AUTHORIZATION_TOKEN)
			.expect(404)
	})

	it('should delete all data and return 204', async () => {
		await request(app).delete('/testing/all-data')
			.expect(204, {})
	});
})
