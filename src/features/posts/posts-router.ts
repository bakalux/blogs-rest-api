import { Router } from "express";
import { body } from 'express-validator';

import { checkAuthorization } from '../../middlewares/authorization';
import { inputValidation } from '../../middlewares/input-validation';
import { Controller } from '../../common/controller';
import { PostsService } from "../../domain/posts-service";
import { PostsQueryRepository } from "./posts-query-repository";

const postsQueryRepository = new PostsQueryRepository();
const postsService = new PostsService();
const postsController = new Controller(postsService, postsQueryRepository);
const postsRouter = Router();

const titleValidation = body('title').isString().trim().notEmpty().isLength({ max: 30 });
const shortDescriptionValidation = body('shortDescription').trim().notEmpty().isString().isLength({ max: 100 });
const contentValidation = body('content').isString().trim().notEmpty().isLength({max: 1000});
const blogIdValidation = body('blogId').isString().trim().notEmpty().custom(async (value) => {
	const isValidBlogId = await postsService.isValidBlogId(value);

	if (!isValidBlogId) {
		return Promise.reject('No such blog');
	}

	return Promise.resolve(true);
});

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
	inputValidation,
	postsController.updateOne
);

postsRouter.delete('/:id', postsController.deleteOne);

export default postsRouter;
