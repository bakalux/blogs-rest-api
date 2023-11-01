import { Request, Response } from 'express';

import { UsersService } from '../../domain/users-service';
import { jwtService } from '../../application/jwt-service';
import { UsersQueryRepository } from "../users/users-query-repository";
import { MeViewModel } from "./auth-model";

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

		if (!userId) {
			res.status(401).send();
			return;
		}

		const token = jwtService.createJWT(userId);
		res.status(200).send({
			accessToken: token,
		});
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

		const data: MeViewModel = {
			userId: user.id,
			login: user.login,
			email: user.email,
		};

		res.status(200).send(data);
	}

	public registration = async (req: Request, res: Response): Promise<void> => {
		await this._service.create({
			login: req.body.login,
			password: req.body.password,
			email: req.body.email
		}, false);



		res.sendStatus(204);
	}
}
