import { Router } from "express";

import { basicAuthorization } from '../../middlewares/authorization';
import { inputValidation } from '../../middlewares/input-validation';
import { UsersController } from './users-controller';
import { UsersQueryRepository } from './users-query-repository';
import { UsersService } from '../../domain/users-service';
import { emailValidation, loginValidation, passwordValidation } from './users-validation';

const usersQueryRepository = new UsersQueryRepository();
const usersService = new UsersService();
const usersController = new UsersController(usersService, usersQueryRepository);
const usersRouter = Router();

usersRouter.use(basicAuthorization);

usersRouter.get('/', usersController.getAll);

usersRouter.post('/',
	loginValidation,
	emailValidation,
	passwordValidation,
	inputValidation,
	usersController.create,
);

usersRouter.delete('/:id', usersController.deleteOne);

export default usersRouter;
