import request from 'supertest';
import { app } from '../src/app';
import { BlogInputModel, BlogPostInputModel, BlogViewModel } from '../src/features/blogs/blogs-model';
import { blogsTestManager } from "./blogs-test-manager";
import { postsTestManager } from './posts-test-manager';
import { AUTHORIZATION_TOKEN } from "./consts";
import { server } from "./server";
import { runDb, closeDbConnection } from "../src/db";
import { PostInputModel, PostViewModel } from '../src/features/posts/posts-model';

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
		await runDb();
		await request(app).delete('/testing/all-data')
			.expect(204)

		const input1: BlogInputModel = {
			name: 'Fancy blog',
			description: 'some description',
			websiteUrl: 'https://vk.com',
		}
		const res1 = await blogsTestManager.createBlog(input1, 201);
		postedBlog1 = res1.body;

		const input2: BlogInputModel = {
			name: 'super blog 2',
			description: 'awesome description 2',
			websiteUrl: 'https://vk2.com',
		}
		const res2 = await blogsTestManager.createBlog(input2, 201);
		postedBlog2 = res2.body;
	})

	afterAll(async () => {
		await closeDbConnection();
		server.close();
	});

	it('should return 200 with correct blogs', async () => {
		const res = await request(app).get('/blogs')
			.expect(200);

		expect(res.body).toEqual({
			totalCount: 2,
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			items: [postedBlog2, postedBlog1]
		})
	});

	it('should correctly return number of items according to pageSize and pageNumber', async () => {
		const res = await request(app).get('/blogs/?pageSize=1&pageNumber=2')
			.expect(200);

		expect(res.body).toEqual({
			totalCount: 2,
			pagesCount: 2,
			page: 2,
			pageSize: 1,
			items: [postedBlog1],
		});
	});

	it('should correctly return search items by searchNameTerm', async () => {
		const res = await request(app).get('/blogs/?searchNameTerm=fancy')
			.expect(200);

		expect(res.body).toEqual({
			totalCount: 1,
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			items: [postedBlog1]
		});
	});

	it('should correctly handle sorting direction', async () => {
		const res1 = await request(app).get('/blogs/?sortDirection=desc')
			.expect(200);

		expect(res1.body).toEqual({
			totalCount: 2,
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			items: [postedBlog2, postedBlog1]
		});

		const res2 = await request(app).get('/blogs/?sortDirection=asc')
			.expect(200);

		expect(res2.body).toEqual({
			totalCount: 2,
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			items: [postedBlog1, postedBlog2]
		});
	});

	it('should correctly sort by sortBy field', async () => {
		const res = await request(app).get('/blogs/?sortBy=description')
			.expect(200);

		expect(res.body).toEqual({
			totalCount: 2,
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			items: [postedBlog1, postedBlog2]
		});
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
			createdAt: expect.any(String),
			isMembership: expect.any(Boolean),
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
			.set('Authorization', AUTHORIZATION_TOKEN)
			.send(validInputData)
			.expect(204)
	})

	it('should not update blog and return 400 with validation errors', async () => {
		const res = await request(app).put(`/blogs/${ postedBlog2.id }`)
			.set('Authorization', AUTHORIZATION_TOKEN)
			.send({
				name: '',
				description: '                    ',
				websiteUrl: '            ',
			})
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
			.set('Authorization', AUTHORIZATION_TOKEN)
			.send(validInputData)
			.expect(404)
	})


	it('should return posts by blogId', async () => {
		const input: PostInputModel = {
			title: 'fancy valid title 1',
			shortDescription: 'some shortDescription 1',
			content: 'beta',
			blogId: postedBlog1.id,
		};
		const res = await postsTestManager.createPost(input, 201, postedBlog1.name);
		const post: PostViewModel = res.body;

		const postsRes = await request(app).get(`/blogs/${ postedBlog1.id }/posts`);
		expect(postsRes.body).toEqual({
			totalCount: 1,
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			items: [post]
		});
	});

	it('should not find posts by not existing blogId and return 404', async () => {
		await request(app).get('/blogs/not-exisiting-blog-id/posts')
			.expect(404);
	});

	it('should create post for existing blog', async () => {
		const blogInput: BlogInputModel = {
			name: 'fancy blog',
			description: 'some description',
			websiteUrl: 'https://vk.com',
		};

		const blogRes = await blogsTestManager.createBlog(blogInput, 201);

		const blog = blogRes.body;

		const data: BlogPostInputModel = {
			title: 'fancy valid title 1',
			shortDescription: 'some shortDescription 1',
			content: 'beta',
		};

		const res = await request(app).post(`/blogs/${ blog.id }/posts`)
			.set('Authorization', AUTHORIZATION_TOKEN)
			.send(data)
			.expect(201);

		expect(res.body).toEqual({
			id: expect.any(String),
			createdAt: expect.any(String),
			blogId: blog.id,
			blogName: blog.name,
			title: data.title,
			shortDescription: data.shortDescription,
			content: data.content,
		})
	});

	it('should not create post with not existing blog id and return 404', async () => {
		const data: BlogPostInputModel = {
			title: 'fancy valid title 1',
			shortDescription: 'some shortDescription 1',
			content: 'beta',
		};

		await request(app).post('/blogs/not-existing-blog-id/posts')
			.set('Authorization', AUTHORIZATION_TOKEN)
			.send(data)
			.expect(404);
	});

	it('should not create post by blog id and return validation errors', async () => {
		const wrongData = {
			title: '            ',
			shortDescription: '',
			content: '               ',
		};

		const res = await request(app).post(`/blogs/${ postedBlog2.id }/posts`)
			.set('Authorization', AUTHORIZATION_TOKEN)
			.send(wrongData)
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
			]
		});
	});

	it('should not create post by blogId and return 401 unauthorized', async () => {
		const data: BlogPostInputModel = {
			title: 'fancy valid title 1',
			shortDescription: 'some shortDescription 1',
			content: 'beta',
		};

		await request(app).post(`/blogs/${ postedBlog2.id }/posts`)
			.send(data)
			.expect(401);
	});

	it('should delete blog and return 204 no content', async () => {
		await request(app).delete(`/blogs/${ postedBlog2.id }`)
			.set('Authorization', AUTHORIZATION_TOKEN)
			.expect(204)
	})

	it('should not delete blog and return 404', async () => {
		await request(app).delete('/blogs/asdfasdfasdf4352345')
			.set('Authorization', AUTHORIZATION_TOKEN)
			.expect(404)
	})

	it('should delete all data and return 204', async () => {
		await request(app).delete('/testing/all-data')
			.expect(204, {})
	})
})
