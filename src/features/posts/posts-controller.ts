import { Request, Response } from 'express';

import { PostsQueryRepository } from './posts-query-repository';
import { PostsService } from '../../domain/posts-service';
import { SortDirection } from '../../common/query-options';

export class PostsController {
	protected _queryRepository: PostsQueryRepository;
	protected _service: PostsService;

	public constructor(
		service: PostsService,
		queryRepository: PostsQueryRepository,
	) {
		this._queryRepository = queryRepository;
		this._service = service
	}

	public getAll = async (req: Request, res: Response): Promise<void> => {
		const { sortDirection, sortBy, pageNumber, pageSize } = req.query;

		const data = await this._queryRepository.getAll({
			sortDirection: sortDirection as SortDirection,
			sortBy,
			pageNumber: typeof pageNumber === 'string' ? Number(pageNumber) : 1,
			pageSize: typeof pageSize === 'string' ? Number(pageSize) : 10,
		});

		res.status(200).send(data);
	}

	public getOne = async (req: Request, res: Response): Promise<void> => {
		const item = await this._queryRepository.getById(req.params.id);

		if (item === null) {
			res.status(404).send();
			return;
		}

		res.status(200).send(item);
	}

	public create = async (req: Request, res: Response): Promise<void> => {
		const data = req.body;
		const item = await this._service.create(data);
		res.status(201).send(item);
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
