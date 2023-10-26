import { Request, Response, Router } from 'express';

import { BlogsService } from "../domain/blogs-service";
import { PostsService } from "../domain/posts-service";
import { UsersService } from '../domain/users-service';
import {CommentsService} from "../domain/comments-service";

const usersService = new UsersService();
const blogsService = new BlogsService();
const postsService = new PostsService();
const commentsService = new CommentsService();

const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
	await Promise.all([blogsService.deleteAll(), postsService.deleteAll(), usersService.deleteAll(), commentsService.deleteAll()]);
	res.status(204).send();
})

export default testingRouter;
