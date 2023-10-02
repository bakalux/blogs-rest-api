import { body } from 'express-validator';
import { UsersQueryRepository } from './users-query-repository';

const usersQueryRepository = new UsersQueryRepository();

export const loginValidation = body('login').isString().notEmpty().isLength({
	min: 3,
	max: 10
}).matches(/^[a-zA-Z0-9_-]*$/).custom(async (value) => {
	const user = await usersQueryRepository.getByLogin(value);

	if (user) {
		return Promise.reject('User with such login already exists');
	}

	return Promise.resolve(true);
});

export const passwordValidation = body('password').isString().notEmpty().isLength({ min: 6, max: 20 })
export const emailValidation = body('email').isString().notEmpty().isEmail().custom(async (value) => {
	const user = await usersQueryRepository.getByEmail(value);

	if (user) {
		return Promise.reject('User with such email already exists');
	}

	return Promise.resolve(true);
});
