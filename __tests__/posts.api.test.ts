import request from 'supertest';
import { app, server } from '../src/index';
import { PostInputModel, PostViewModel } from '../src/features/posts/posts-model';
import { postsTestManager } from './posts-test-manager';
import { blogsTestManager } from "./blogs-test-manager";
import { BlogInputModel, BlogViewModel } from "../src/features/blogs/blogs-model";
import { AUTHORIZATION_TOKEN } from "./consts";


type UnknownPostInputModel = {
	[K in keyof PostInputModel]: unknown;
}

describe('/posts', () => {
	let postedPost1: PostViewModel;
	let postedPost2: PostViewModel;
    let validInputData: PostInputModel;
    let bindingBlog: BlogViewModel;
	beforeAll(async () => {
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
			title: 'valid title 1',
			shortDescription: 'valid shortDescription 1',
			content: 'https://valid.com',
			blogId: bindingBlog.id,
		}

		const res1 = await postsTestManager.createPost(input1, 201)
		postedPost1 = res1.body;

		const input2: PostInputModel = {
			title: 'valid title 2',
			shortDescription: 'valid shortDescription 2',
			content: 'asdfasdf',
			blogId: bindingBlog.id,
		}

		const res2 = await postsTestManager.createPost(input2, 201)
		postedPost2 = res2.body;
	})

	afterAll(() => {
		server.close();
	});

	it('should return 200 with correct posts', async () => {
		await request(app).get('/posts')
			.expect(200, [postedPost1, postedPost2]);
	});

	it('should return 200 with correct post', async () => {
		await request(app).get(`/posts/${ postedPost1.id }`)
	});

	it('should not delete post and return 404', async () => {
		await request(app).get('/posts/asdfasdfasdf4352345')
			.expect(404)
	})

	it('should create new post with correct data and return created post', async () => {
		const response = await postsTestManager.createPost(validInputData, 201);

		expect(response.body).toEqual({
			id: expect.any(String),
			title: validInputData.title,
			shortDescription: validInputData.shortDescription,
			content: validInputData.content,
			blogId: validInputData.blogId,
			blogName: validInputData.title + validInputData.shortDescription
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

	it('should delete post and return 204 no content', async () => {
		await request(app).delete(`/posts/${ postedPost2.id }`)
			.set('Authorization', AUTHORIZATION_TOKEN)
			.expect(204)
	})

	it('should not delete post and return 404', async () => {
		await request(app).delete('/posts/asdfasdfasdf4352345')
			.set('Authorization', AUTHORIZATION_TOKEN)
			.expect(404)
	})

	it('should delete all data and return 204', async () => {
		await request(app).delete('/testing/all-data')
			.expect(204, {})
	})
})
