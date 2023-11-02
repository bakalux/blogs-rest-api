import { body } from 'express-validator';
import {UsersQueryRepository} from "../users/users-query-repository";

const usersQueryRepository = new UsersQueryRepository();

export const loginOrEmailValidation = body('loginOrEmail').isString().trim().notEmpty();
export const passwordLoginValidation = body('password').isString().trim().notEmpty();
export const registrationConfirmationCodeValidation = body('code').isString().trim().custom(async (value) => {
	const user = await usersQueryRepository.getByConfirmationCode(value);

	if (!user) {
		return Promise.reject('No user with such code');
	}

    if (user.isConfirmed) {
       return Promise.reject('User is already confirmed');
    }

	return Promise.resolve(true);
});

export const emailConfirmationResendingValidation = body('email').trim().isEmail().custom(async (value) => {
	const user = await usersQueryRepository.getByEmail(value);

	if (!user) {
		return Promise.reject('No user with such email');
	}

    if (user.isConfirmed) {
       return Promise.reject('User is already confirmed');
    }

	return Promise.resolve(true);
});


