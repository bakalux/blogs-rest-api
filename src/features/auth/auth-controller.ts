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
		res.status(201).send();
	}
}
