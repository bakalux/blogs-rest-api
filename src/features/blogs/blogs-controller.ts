import { Request, Response } from 'express';

import { BlogsService } from '../../domain/blogs-service';
import { BlogsQueryRepository } from './blogs-query-repository';
import { PostsService } from '../../domain/posts-service';
import { SortDirection } from '../../common/iquery-repository';

export class BlogsController {
	protected _queryRepository: BlogsQueryRepository;
	protected _service: BlogsService;
	private _postsService: PostsService;

	public constructor(
		service: BlogsService,
		queryRepository: BlogsQueryRepository,
		postsService: PostsService,
	) {
		this._queryRepository = queryRepository;
		this._service = service;
		this._postsService = postsService;
	}

	public getAll = async (req: Request, res: Response): Promise<void> => {
		const { sortDirection, sortBy, searchNameTerm, pageNumber, pageSize } = req.query;

		const data  = await this._queryRepository.getAll({
			sortDirection: sortDirection as SortDirection,
			sortBy,
			searchNameTerm: typeof searchNameTerm === 'string' ? searchNameTerm : undefined,
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

		if(!isDeleted) {
			res.status(404).send();
			return;
		}

		res.status(204).send();
	}

	public getBlogPosts = async (req: Request, res: Response) => {
		const { sortDirection, sortBy, pageNumber, pageSize } = req.query;
		const posts = await this._queryRepository.getBlogPosts(req.params.id, {
			sortDirection: sortDirection as SortDirection,
			sortBy,
			pageNumber: typeof pageNumber === 'string' ? Number(pageNumber) : 1,
			pageSize: typeof pageSize === 'string' ? Number(pageSize) : 10,
		});

		if (posts === null) {
			res.status(404).send();
			return;
		}
		res.status(200).send(posts);
	}

	public createPostForBlog = async (req: Request, res: Response) => {
		const blog = await this._queryRepository.getById(req.params.id);

		if (blog === null) {
			res.status(404).send();
			return;
		}

		const created = await this._postsService.create({ ...req.body, blogId: blog.id });

		res.status(201).send(created);
	}
}
