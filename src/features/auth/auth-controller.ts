import { Request, Response } from 'express';

import { UsersService } from '../../domain/users-service';

export class AuthController {
	protected _service: UsersService;

	public constructor(
		service: UsersService,
	) {
		this._service = service;
	}

	public login = async (req: Request, res: Response): Promise<void> => {
		const isAuth = await this._service.checkCredentials(req.body);

		if (isAuth) {
			res.status(204).send();
			return;
		}

		res.status(401).send();
	}
}
