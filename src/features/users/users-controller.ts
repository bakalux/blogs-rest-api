import { ControllerBase } from '../../common/controller-base';
import { UserInputModel, UserViewModel } from './users-model';
import { UsersQueryRepository } from './users-query-repository';
import { UsersService } from '../../domain/users-service';

export class UsersController extends ControllerBase<UserViewModel, UserInputModel> {
	protected _queryRepository: UsersQueryRepository;
	protected _service: UsersService;

	public constructor(
		service: UsersService,
		queryRepository: UsersQueryRepository
	) {
		super();
		this._service = service;
		this._queryRepository = queryRepository;
	}
}
