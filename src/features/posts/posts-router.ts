import { Router } from "express";

import { checkAuthorization } from '../../middlewares/authorization';
import { inputValidation } from '../../middlewares/input-validation';
import { PostsController } from './posts-controller';
import { PostsService } from "../../domain/posts-service";
import { PostsQueryRepository } from "./posts-query-repository";
import {
	blogIdValidation,
	contentValidation,
	shortDescriptionValidation,
	titleValidation
} from '../../common/validation/posts-validation';

const postsQueryRepository = new PostsQueryRepository();
const postsService = new PostsService();
const postsController = new PostsController(postsService, postsQueryRepository);
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
	inputValidation,
	postsController.updateOne
);

postsRouter.delete('/:id', postsController.deleteOne);

export default postsRouter;
