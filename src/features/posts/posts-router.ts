import { Router } from "express";
import { body } from 'express-validator';

import { checkAuthorization } from '../../middlewares/authorization';
import { inputValidation } from '../../middlewares/input-validation';
import { Controller } from '../../common/controller';
import { postsRepository } from './posts-repository';
import { blogsRepository } from '../../features/blogs/blogs-repository';

const titleValidation = body('title').notEmpty().isString().isLength({ max: 30 });
const shortDescriptionValidation = body('shortDescription').notEmpty().isString().isLength({ max: 100 });
const contentValidation = body('content').notEmpty().isString().isLength({ max: 1000 });
const blogIdValidation = body('blogId').notEmpty().isString().custom((value) => {
	blogsRepository.getById(value);
});

const postsController = new Controller(postsRepository);
const postsRouter = Router();

postsRouter.use(checkAuthorization);

postsRouter.get('/', postsController.getAll);

postsRouter.post('/',
	titleValidation,
	shortDescriptionValidation,
	contentValidation,
	blogIdValidation,
	inputValidation,
	postsController.create,
);

postsRouter.get('/:id', postsController.getOne);

postsRouter.put('/:id',
	titleValidation,
	shortDescriptionValidation,
	contentValidation,
	blogIdValidation,
	postsController.updateOne
);

postsRouter.delete('/:id', postsController.deleteOne);

export default postsRouter;
