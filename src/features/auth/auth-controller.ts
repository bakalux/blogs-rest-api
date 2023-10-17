import { Request, Response } from 'express';

import { UsersService } from '../../domain/users-service';
import { jwtService } from '../../application/jwt-service';
import {UsersQueryRepository} from "../users/users-query-repository";

export class AuthController {
	protected _service: UsersService;
	private _queryRepository: UsersQueryRepository;

	public constructor(
		service: UsersService,
		queryRepository: UsersQueryRepository,
	) {
		this._service = service;
		this._queryRepository = queryRepository;
	}

	public login = async (req: Request, res: Response): Promise<void> => {
		const userId = await this._service.checkCredentials(req.body);

		if (userId) {
			const token = jwtService.createJWT(userId);
			res.status(200).send({
				accessToken: token,
			});
			return;
		}

		res.status(401).send();
	}

	public me = async  (req: Request, res: Response): Promise<void> => {
		if (req.userId === null) {
			res.status(401).send();
			return;
		}

		const user = await this._queryRepository.getById(req.userId);

		if (user === null) {
			res.status(401).send();
			return
		}

		res.status(200).send({
			userId: user.id,
			login: user.login,
			email: user.email,
		});
	}
}
