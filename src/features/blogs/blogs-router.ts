import { Router } from "express";
import { body } from 'express-validator';

import { checkAuthorization } from '../../middlewares/authorization';
import { inputValidation } from '../../middlewares/input-validation';
import { Controller } from '../../common/controller';
import { BlogsService } from "../../domain/blogs-service";

const nameValidation = body('name').isString().trim().notEmpty().isLength({ max: 15 });
const descriptionValidation = body('description').isString().trim().notEmpty().isLength({ max: 500 });
const urlValidation = body('websiteUrl').trim().notEmpty().isURL().isLength({ max: 100 });

const blogsService = new BlogsService();
const blogsController = new Controller(blogsService);
const blogsRouter = Router()

blogsRouter.use(checkAuthorization);

blogsRouter.get('/', blogsController.getAll);

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
