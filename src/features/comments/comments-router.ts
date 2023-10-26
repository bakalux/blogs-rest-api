import { Router } from "express";

import { bearerAuthorization } from '../../middlewares/authorization';
import { inputValidation } from '../../middlewares/input-validation';
import {CommentsController} from "./comments-controller";
import {contentValidation} from "./comments-validation";
import {CommentsQueryRepository} from "./comments-query-repository";
import {CommentsService} from "../../domain/comments-service";

const commentsQueryRepository = new CommentsQueryRepository();
const commentsService = new CommentsService();
const commentsController = new CommentsController(commentsService, commentsQueryRepository);
const commentsRouter = Router();


commentsRouter.use(bearerAuthorization);

commentsRouter.get('/:id', commentsController.getOne);

commentsRouter.put('/:id',
    contentValidation,
	inputValidation,
	commentsController.updateOne
);

commentsRouter.delete('/:id', commentsController.deleteOne);
export default commentsRouter;
