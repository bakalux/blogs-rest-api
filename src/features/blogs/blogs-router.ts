import { Router } from "express";
import { body } from 'express-validator';

import { blogsController } from './blogs-controller';
import { checkAuthorization } from '../../middlewares/authorization';
import { inputValidation } from '../../middlewares/input-validation';

const blogsRouter = Router()

blogsRouter.use(checkAuthorization);

blogsRouter.get('/', blogsController.getAll);

const nameValidation = body('name').notEmpty().isString().isLength({ max: 15 });
const descriptionValidation = body('description').notEmpty().isString().isLength({ max: 500 });
const urlValidation = body('websiteUrl').notEmpty().isURL().isLength({ max: 100 });

blogsRouter.post('/',
	nameValidation,
	descriptionValidation,
	urlValidation,
	inputValidation,
	blogsController.create,
);

blogsRouter.get('/:id', blogsController.getOne);

blogsRouter.put('/:id',
	nameValidation,
	descriptionValidation,
	urlValidation,
	inputValidation,
	blogsController.updateOne
);

blogsRouter.delete('/:id', blogsController.deleteOne);

export default blogsRouter;
