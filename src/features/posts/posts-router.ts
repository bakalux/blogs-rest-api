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
import {CommentsQueryRepository} from "../comments/comments-query-repository";

const postsQueryRepository = new PostsQueryRepository();
const postsService = new PostsService();
const commentsService = new CommentsService();
const commentsQueryRepository = new CommentsQueryRepository();
const postsController = new PostsController(postsService, postsQueryRepository, commentsService, commentsQueryRepository);
const postsRouter = Router();


postsRouter.get('/', postsController.getAll);

postsRouter.post('/',
	basicAuthorization,
	titleValidation,
	shortDescriptionValidation,
	contentValidation,
	blogIdValidation,
	inputValidation,
	postsController.create,
);

postsRouter.get('/:id', postsController.getOne);

postsRouter.put('/:id',
	basicAuthorization,
	titleValidation,
	shortDescriptionValidation,
	contentValidation,
	blogIdValidation,
	inputValidation,
	postsController.updateOne
);

postsRouter.delete('/:id', basicAuthorization, postsController.deleteOne);

postsRouter.post('/:id/comments',
	bearerAuthorization,
	commentContentValidation,
	inputValidation,
	postsController.createComment
);
postsRouter.get('/:id/comments', postsController.getComments);

export default postsRouter;
