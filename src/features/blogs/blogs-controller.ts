import { Request, Response } from 'express';

import { ControllerBase } from '../../common/controller-base';
import { BlogInputModel, BlogViewModel } from './blogs-model';
import { BlogsService } from '../../domain/blogs-service';
import { BlogsQueryRepository } from './blogs-query-repository';
import { PostsService } from '../../domain/posts-service';

export class BlogsController extends ControllerBase<BlogViewModel, BlogInputModel> {
	protected _queryRepository: BlogsQueryRepository;
	protected _service: BlogsService;
	private _postsService: PostsService;

	public constructor(
		service: BlogsService,
		queryRepository: BlogsQueryRepository,
		postsService: PostsService,
	) {
		super();
		this._queryRepository = queryRepository;
		this._service = service;
		this._postsService = postsService;
	}

	public getBlogPosts = async (req: Request, res: Response) => {
		const posts = await this._queryRepository.getBlogPosts(req.params.id);

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
