import request from 'supertest';

import {app} from '../src/index';
import {BlogInputModel} from "../src/features/blogs/blogs-model";

export const AUTHORIZATION_TOKEN = 'admin:qwerty';

export const blogsTestManager = {
    async createBlog(data: BlogInputModel, expectedStatusCode: number) {
        const response = await request(app).post('/blogs')
            .set('authorization', AUTHORIZATION_TOKEN)
            .send(data)
            .expect(expectedStatusCode)

        if (expectedStatusCode === 201) {
            const created = response.body;
            expect(created).toEqual({
                ...data,
                id: expect.any(String),
            });
        }

        return response
    },
    async createBlogUnauthorized(data: BlogInputModel) {
        const response = await request(app).post('/blogs')
            .send(data)
            .expect(401)

        return response
    }
}
