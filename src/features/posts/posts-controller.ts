import { ControllerBase } from '../../common/controller-base';
import { PostInputModel, PostViewModel } from './posts-model';
import { PostsQueryRepository } from './posts-query-repository';
import { PostsService } from '../../domain/posts-service';

export class PostsController extends ControllerBase<PostViewModel, PostInputModel> {
	protected _queryRepository: PostsQueryRepository;
	protected _service: PostsService;

	public constructor(
		service: PostsService,
		queryRepository: PostsQueryRepository,
	) {
		super();
		this._queryRepository = queryRepository;
		this._service = service
	}
}
