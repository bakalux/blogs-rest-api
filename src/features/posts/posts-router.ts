import { Router } from "express";

import {basicAuthorization, bearerAuthorization} from '../../middlewares/authorization';
import { inputValidation } from '../../middlewares/input-validation';
import { PostsController } from './posts-controller';
import { PostsService } from "../../domain/posts-service";
import { PostsQueryRepository } from "./posts-query-repository";
import {
	blogIdValidation,
	contentValidation,
	shortDescriptionValidation,
	titleValidation
} from './posts-validation';
import {
	contentValidation as commentContentValidation,
} from '../comments/comments-validation';
import {CommentsService} from "../../domain/comments-service";

const postsQueryRepository = new PostsQueryRepository();
const postsService = new PostsService();
const commentsSerivce = new CommentsService();
const postsController = new PostsController(postsService, postsQueryRepository, commentsSerivce);
const postsRouter = Router();

postsRouter.use(basicAuthorization);

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

postsRouter.post('/:id/comments', bearerAuthorization, commentContentValidation, postsController.createComment);
postsRouter.get('/:id/comments', postsController.getComments);

export default postsRouter;
