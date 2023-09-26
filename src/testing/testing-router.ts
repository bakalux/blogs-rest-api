import { Request, Response, Router } from 'express';

import { blogsRepository } from '../features/blogs/blogs-repository';
import { postsRepository } from '../features/posts/posts-repository';

const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
	await Promise.all([blogsRepository.deleteAll(), postsRepository.deleteAll()]);
	res.status(204).send();
})

export default testingRouter;
