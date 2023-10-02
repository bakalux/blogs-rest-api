import { Router } from "express";

import { checkAuthorization } from '../../middlewares/authorization';
import { inputValidation } from '../../middlewares/input-validation';
import { BlogsController } from './blogs-controller';
import { BlogsService } from "../../domain/blogs-service";
import { BlogsQueryRepository } from "./blogs-query-repository";
import { PostsService } from '../../domain/posts-service';
import { descriptionValidation, nameValidation, urlValidation } from './blogs-validation';
import {
	contentValidation,
	shortDescriptionValidation,
	titleValidation
} from '../posts/posts-validation';

const blogsQueryRepository = new BlogsQueryRepository();
const blogsService = new BlogsService();
const postsService = new PostsService();
const blogsController = new BlogsController(blogsService, blogsQueryRepository, postsService);
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

blogsRouter.get('/:id/posts', blogsController.getBlogPosts);
blogsRouter.post('/:id/posts',
	titleValidation,
	shortDescriptionValidation,
	contentValidation,
	inputValidation,
	blogsController.createPostForBlog,
);

export default blogsRouter;
