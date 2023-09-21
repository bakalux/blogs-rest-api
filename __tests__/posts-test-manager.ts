import request from 'supertest';

import {app} from '../src/index';
import {PostInputModel} from "../src/features/posts/posts-model";

export const AUTHORIZATION_TOKEN = 'admin:qwerty';

export const postsTestManager = {
    async createPost(data: PostInputModel, expectedStatusCode: number) {
        const response = await request(app).post('/posts')
            .set('authorization', AUTHORIZATION_TOKEN)
            .send(data)
            .expect(expectedStatusCode)

        if (expectedStatusCode === 201) {
            const created = response.body;
            expect(created).toEqual({
                ...data,
                id: expect.any(String),
                blogName: data.title + data.shortDescription,
            });
        }

        return response
    },
    async createPostUnauthorized(data: PostInputModel) {
        const response = await request(app).post('/posts')
            .send(data)
            .expect(401)

        return response
    }
}
