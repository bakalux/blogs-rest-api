import { Router } from "express";

import { blogsController } from './blogs-controller';
import { checkAuthorization } from '../../middlewares/authorization';

const blogsRouter = Router()

blogsRouter.use(checkAuthorization);

blogsRouter.get('/', blogsController.getAll);

blogsRouter.post('/', blogsController.create);

blogsRouter.get('/:id', blogsController.getOne);

blogsRouter.put('/:id', blogsController.updateOne);

blogsRouter.delete('/:id', blogsController.deleteOne);

export default blogsRouter;
