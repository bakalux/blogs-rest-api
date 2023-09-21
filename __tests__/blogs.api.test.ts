import request from 'supertest';
import { app, server } from '../src/index';
import { BlogInputModel, BlogViewModel } from '../src/features/blogs/blogs-model';
import {blogsTestManager} from "./blogs-test-manager";


const AUTHORIZATION_TOKEN = 'admin:qwerty';

type UnknownBlogInputModel = {
	[K in keyof BlogInputModel]: unknown;
}

const validInputData: BlogInputModel = {
	name: 'valid name',
	description: 'valid description',
	websiteUrl: 'https://valid.com',
}

describe('/blogs', () => {
	let postedBlog1: BlogViewModel;
	let postedBlog2: BlogViewModel;
	beforeAll(async () => {
		await request(app).delete('/testing/all-data')
			.expect(204)

		const input1: BlogInputModel = {
			name: 'mock blog',
			description: 'mock description',
			websiteUrl: 'https://vk.com',
		}
		const res1 = await blogsTestManager.createBlog(input1, 201);
		postedBlog1 = res1.body;

		const input2: BlogInputModel = {
			name: 'mock blog 2',
			description: 'mock description 2',
			websiteUrl: 'https://vk2.com',
		}
		const res2 = await blogsTestManager.createBlog(input2, 201);
		postedBlog2 = res2.body;
	})

	afterAll(() => {
		server.close();
	});

	it('should return 200 with correct blogs', async () => {
		await request(app).get('/blogs')
			.expect(200, [postedBlog1, postedBlog2]);
	});

	it('should return 200 with correct blog', async () => {
		await request(app).get(`/blogs/${ postedBlog1.id }`)
	});

	it('should not delete blog and return 404', async () => {
		await request(app).get('/blogs/asdfasdfasdf4352345')
			.expect(404)
	})

	it('should create new blog with correct data and return created blog', async () => {
		const response = await blogsTestManager.createBlog(validInputData, 201);

		expect(response.body).toEqual({
			id: expect.any(String),
			name: validInputData.name,
			description: validInputData.description,
			websiteUrl: validInputData.websiteUrl,
		});
	})

	it('should not create new blog and return validation errors', async () => {
		const wrongData: UnknownBlogInputModel = {
			name: 4124312,
			description: [],
			websiteUrl: 'https:fasdf.com',
		}

		const res = await blogsTestManager.createBlog(wrongData as BlogInputModel, 400);

		expect(res.body).toEqual({
			errorsMessages: [
				{
					message: expect.any(String),
					field: 'name'
				},
				{
					message: expect.any(String),
					field: 'description'
				},
				{
					message: expect.any(String),
					field: 'websiteUrl'
				},
			]
		});
	})

	it('should not create blog and return 401 unauthorized', async () => {
		await blogsTestManager.createBlogUnauthorized(validInputData);
	})

	it('should update blog and return 204 with no content', async () => {
		await request(app).put(`/blogs/${ postedBlog2.id }`)
			.set('authorization', AUTHORIZATION_TOKEN)
			.send(validInputData)
			.expect(204)
	})

	it('should not update blog and return 400 with validation errors', async () => {
		const res = await request(app).put(`/blogs/${ postedBlog2.id }`)
			.set('authorization', AUTHORIZATION_TOKEN)
			.send({})
			.expect(400);

		expect(res.body).toEqual({
			errorsMessages: [
				{
					message: expect.any(String),
					field: 'name'
				},
				{
					message: expect.any(String),
					field: 'description'
				},
				{
					message: expect.any(String),
					field: 'websiteUrl'
				},
			]
		});
	});

	it('should not update blog and return 401 unauthorized', async () => {
		await request(app).put(`/blogs/${ postedBlog2.id }`)
			.send(validInputData)
			.expect(401)
	})

	it('should not update blog and return 404', async () => {
		await request(app).put('/blogs/asdfasdfasdf4352345')
			.set('authorization', AUTHORIZATION_TOKEN)
			.send(validInputData)
			.expect(404)
	})

	it('should delete blog and return 204 no content', async () => {
		await request(app).delete(`/blogs/${ postedBlog2.id }`)
			.set('authorization', AUTHORIZATION_TOKEN)
			.expect(204)
	})

	it('should not delete blog and return 404', async () => {
		await request(app).delete('/blogs/asdfasdfasdf4352345')
			.set('authorization', AUTHORIZATION_TOKEN)
			.expect(404)
	})

	it('should delete all data and return 204', async () => {
		await request(app).delete('/testing/all-data')
			.expect(204, {})
	})
})
