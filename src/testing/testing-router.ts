import { Request, Response, Router } from 'express';

import { blogsRepository } from '../features/blogs/blogs-repository';

const testingRouter = Router();

testingRouter.delete('/all-data', (req: Request, res: Response) => {
	blogsRepository.deleteAll();
	res.status(204).send();
})

export default testingRouter;
