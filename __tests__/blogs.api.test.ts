import request from 'supertest';
import { app, server } from '../src/index';
import { BlogInputModel, BlogViewModel } from '../src/features/blogs/blogs-model';


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
		const res1 = await request(app).post('/blogs')
			.set('authorization', AUTHORIZATION_TOKEN)
			.send(input1)
			.expect(201);
		postedBlog1 = res1.body;

		const input2: BlogInputModel = {
			name: 'mock blog 2',
			description: 'mock description 2',
			websiteUrl: 'https://vk2.com',
		}
		const res2 = await request(app).post('/blogs')
			.set('authorization', AUTHORIZATION_TOKEN)
			.send(input2)
			.expect(201);
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
		const response = await request(app).post('/blogs')
			.set('authorization', AUTHORIZATION_TOKEN)
			.send(validInputData)
			.expect(201);

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

		await request(app).post('/blogs')
			.set('authorization', AUTHORIZATION_TOKEN)
			.send(wrongData)
			.expect(400, {
				errorsMessages: [{
					message: expect.any(String),
					field: 'name'
				},
					{
						message: expect.any(String),
						field: 'websiteUrl'
					},
					{
						message: expect.any(String),
						field: 'name'
					},
				]
			})
	})

	it('should not create blog and return 401 unauthorized', async () => {
		await request(app).post('/blogs')
			.send(validInputData)
			.expect(401)
	})

	it('should update blog and return 204 with no content', async () => {
		await request(app).put(`/blogs/${ postedBlog2.id }`)
			.set('authorization', AUTHORIZATION_TOKEN)
			.send(validInputData)
			.expect(204)
	})

	it('should not update blog and return 400 with validation errors', async () => {
		await request(app).put(`/blogs/${ postedBlog2.id }`)
			.set('authorization', AUTHORIZATION_TOKEN)
			.send({})
			.expect({
				errorsMessages: [{
					message: expect.any(String),
					field: 'name'
				},
					{
						message: expect.any(String),
						field: 'websiteUrl'
					},
					{
						message: expect.any(String),
						field: 'name'
					},
				]
			})
	});

	it('should not update blog and return 401 unauthorized', async () => {
		await request(app).put(`/blogs/${ postedBlog2.id }`)
			.send(validInputData)
			.expect(401)
	})

	it('should not update blog and return 404', async () => {
		await request(app).put('/blogs/asdfasdfasdf4352345')
			.set('authorization', AUTHORIZATION_TOKEN)
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
