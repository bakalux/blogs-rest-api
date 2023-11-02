import { Router } from 'express';

import { AuthController } from './auth-controller';
import { UsersService } from '../../domain/users-service';
import { loginOrEmailValidation, passwordLoginValidation} from './auth-validation';
import { inputValidation } from '../../middlewares/input-validation';
import {bearerAuthorization} from "../../middlewares/authorization";
import {UsersQueryRepository} from "../users/users-query-repository";
import {emailValidation, passwordValidation, loginValidation} from "../users/users-validation";

const authRouter = Router();
const usersService = new UsersService();
const usersQueryRepository = new UsersQueryRepository();
const controller = new AuthController(usersService, usersQueryRepository);

authRouter.post(
	'/login',
	loginOrEmailValidation,
	passwordLoginValidation,
	inputValidation,
	controller.login
);

authRouter.get(
	'/me',
	bearerAuthorization,
	controller.me
);

authRouter.post(
	'/registration',
	loginValidation,
	emailValidation,
	passwordValidation,
	inputValidation,
	controller.registration
)

authRouter.post(
	'/registration-confirmation',
	controller.registrationConfirmation
)

authRouter.post(
	'/registration-email-resending',
	controller.registrationEmailResending,
)

export default authRouter;
