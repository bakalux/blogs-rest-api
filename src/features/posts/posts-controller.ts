import { Request, Response } from 'express';

import { PostsQueryRepository } from './posts-query-repository';
import { PostsService } from '../../domain/posts-service';
import { SortDirection } from '../../common/query-options';
import {CommentsService} from "../../domain/comments-service";

export class PostsController {
	private _postsQueryRepository: PostsQueryRepository;
	private _postsService: PostsService;
	private _commentsService: CommentsService;

	public constructor(
		service: PostsService,
		queryRepository: PostsQueryRepository,
		commentsSerivce: CommentsService
	) {
		this._postsQueryRepository = queryRepository;
		this._postsService = service
		this._commentsService = commentsSerivce
	}

	public getAll = async (req: Request, res: Response): Promise<void> => {
		const { sortDirection, sortBy, pageNumber, pageSize } = req.query;

		const data = await this._postsQueryRepository.getAll({
			sortDirection: sortDirection as SortDirection,
			sortBy,
			pageNumber: typeof pageNumber === 'string' ? Number(pageNumber) : 1,
			pageSize: typeof pageSize === 'string' ? Number(pageSize) : 10,
		});

		res.status(200).send(data);
	}

	public getOne = async (req: Request, res: Response): Promise<void> => {
		const item = await this._postsQueryRepository.getById(req.params.id);

		if (item === null) {
			res.status(404).send();
			return;
		}

		res.status(200).send(item);
	}

	public create = async (req: Request, res: Response): Promise<void> => {
		const data = req.body;
		const item = await this._postsService.create(data);
		res.status(201).send(item);
	}

	public updateOne = async (req: Request, res: Response): Promise<void> => {
		const data = req.body;

		const updated = await this._postsService.updateById(req.params.id, data);

		if (!updated) {
			res.status(404).send();
			return;
		}

		res.status(204).send();
	}

	public deleteOne = async (req: Request, res: Response): Promise<void> => {
		const isDeleted = await this._postsService.deleteById(req.params.id);

		if (!isDeleted) {
			res.status(404).send();
			return;
		}

		res.status(204).send();
	}

	public createComment = async (req: Request, res: Response): Promise<void> => {
		const post =  await this._postsQueryRepository.getById(req.params.id);

		if (!post) {
			res.status(404).send();
		}

		const data = req.body;
		const item = await this._commentsService.create({...data, userId: req.userId });
		res.status(201).send(item);
	}


	public getComments = async (req: Request, res: Response): Promise<void> => {
		const post = await this._postsQueryRepository.getById(req.params.id);

		if (!post) {
			res.status(404).send();
		}

		const { sortDirection, sortBy, pageNumber, pageSize } = req.query;

		const data = await this._postsQueryRepository.getAll({
			sortDirection: sortDirection as SortDirection,
			sortBy,
			pageNumber: typeof pageNumber === 'string' ? Number(pageNumber) : 1,
			pageSize: typeof pageSize === 'string' ? Number(pageSize) : 10,
		});

		res.status(200).send(data);
	}
}
