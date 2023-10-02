import { Request, Response } from 'express';

import { UsersQueryRepository } from './users-query-repository';
import { UsersService } from '../../domain/users-service';
import { SortDirection } from '../../common/iquery-repository';

export class UsersController {
	protected _queryRepository: UsersQueryRepository;
	protected _service: UsersService;

	public constructor(
		service: UsersService,
		queryRepository: UsersQueryRepository
	) {
		this._service = service;
		this._queryRepository = queryRepository;
	}

	public getAll = async (req: Request, res: Response): Promise<void> => {
		const { sortDirection, sortBy, searchEmailTerm, searchLoginTerm, pageNumber, pageSize } = req.query;

		const data  = await this._queryRepository.getAll({
			sortDirection: sortDirection as SortDirection,
			sortBy,
			searchEmailTerm: typeof searchEmailTerm === 'string' ? searchEmailTerm : undefined,
			searchLoginTerm: typeof searchLoginTerm === 'string' ? searchLoginTerm : undefined,
			pageNumber: typeof pageNumber === 'string' ? Number(pageNumber) : 1,
			pageSize: typeof pageSize === 'string' ? Number(pageSize) : 10,
		});

		res.status(200).send(data);
	}

	public create = async (req: Request, res: Response): Promise<void> => {
		const data = req.body;
		const item = await this._service.create(data);
		res.status(201).send(item);
	}

	public deleteOne = async (req: Request, res: Response): Promise<void> => {
		const isDeleted = await this._service.deleteById(req.params.id);

		if(!isDeleted) {
			res.status(404).send();
			return;
		}

		res.status(204).send();
	}
}
