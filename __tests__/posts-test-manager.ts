import request from 'supertest';

import { app } from '../src/index';
import { PostInputModel } from "../src/features/posts/posts-model";
import { AUTHORIZATION_TOKEN } from "./consts";

export const postsTestManager = {
    async createPost(data: PostInputModel, expectedStatusCode: number, expectedBlogName?: string) {
        const response = await request(app).post('/posts')
            .set('Authorization', AUTHORIZATION_TOKEN)
            .send(data)
            .expect(expectedStatusCode)

        if (expectedStatusCode === 201) {
            const created = response.body;
            expect(created).toEqual({
                ...data,
                id: expect.any(String),
                blogName: expectedBlogName,
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
