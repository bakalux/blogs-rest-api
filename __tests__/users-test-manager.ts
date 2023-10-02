import request from 'supertest';

import { app } from '../src/app';
import { UserInputModel } from "../src/features/users/users-model";
import { AUTHORIZATION_TOKEN } from "./consts";


export const usersTestManager = {
    async createUser(data: UserInputModel, expectedStatusCode: number) {
        const response = await request(app).post('/users')
            .set('Authorization', AUTHORIZATION_TOKEN)
            .send(data)
            .expect(expectedStatusCode)

        if (expectedStatusCode === 201) {
            const created = response.body;
            expect(created).toEqual({
                createdAt: expect.any(String),
				id: expect.any(String),
				login: data.login,
				email: data.email,
            });
        }

        return response
    },
    async createUserUnauthorized(data: UserInputModel) {
        const response = await request(app).post('/users')
            .send(data)
            .expect(401)

        return response
    }
}
