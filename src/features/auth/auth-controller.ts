import { Request, Response } from 'express';

import { UsersService } from '../../domain/users-service';
import { jwtService } from '../../application/jwt-service';

export class AuthController {
	protected _service: UsersService;

	public constructor(
		service: UsersService,
	) {
		this._service = service;
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
}
