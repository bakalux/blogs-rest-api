import { Request, Response } from 'express';

import { CommentsQueryRepository } from './comments-query-repository';
import { CommentsService } from '../../domain/comments-service';

export class CommentsController {
	private _commentsQueryRepository: CommentsQueryRepository;
	private _service: CommentsService;

	public constructor(
		service: CommentsService,
		queryRepository: CommentsQueryRepository,
	) {
		this._commentsQueryRepository = queryRepository;
		this._service = service
	}
	public getOne = async (req: Request, res: Response): Promise<void> => {
		const item = await this._commentsQueryRepository.getById(req.params.id);

		if (item === null) {
			res.status(404).send();
			return;
		}

		res.status(200).send(item);
	}

	public updateOne = async (req: Request, res: Response): Promise<void> => {
		const data = req.body;

		const updated = await this._service.updateById(req.params.id, data);

		if (!updated) {
			res.status(404).send();
			return;
		}

		res.status(204).send();
	}

	public deleteOne = async (req: Request, res: Response): Promise<void> => {
		const isDeleted = await this._service.deleteById(req.params.id);

		if (!isDeleted) {
			res.status(404).send();
			return;
		}

		res.status(204).send();
	}
}
