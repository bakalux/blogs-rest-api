import { Router } from 'express';

import { AuthController } from './auth-controller';
import { UsersService } from '../../domain/users-service';
import { loginOrEmailValidation, passwordLoginValidation } from './auth-validation';
import { inputValidation } from '../../middlewares/input-validation';

const authRouter = Router();
const usersService = new UsersService();
const controller = new AuthController(usersService);

authRouter.post(
	'/login',
	loginOrEmailValidation,
	passwordLoginValidation,
	inputValidation,
	controller.login
);

export default authRouter;
