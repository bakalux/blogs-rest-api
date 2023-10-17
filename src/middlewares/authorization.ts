import { Request, Response, NextFunction } from 'express';
import {jwtService} from "../application/jwt-service";
import {UsersQueryRepository} from "../features/users/users-query-repository";


const usersQueryRepository = new UsersQueryRepository();
export function basicAuthorization(req: Request, res: Response, next: NextFunction): void {
	if (req.method === 'GET' && req.originalUrl !== '/users') {
		next();
		return;
	}

	if (!req.headers.authorization) {
		res.status(401).send();
		return;
	}

	const encoded = req.headers.authorization.replace('Basic ', '');
	const buff = Buffer.from(encoded, 'base64');

	const token = buff.toString('ascii');

	const [username, password] = token.split(':');

	if (username !== 'admin' || password !== 'qwerty') {
		res.status(401).send();
		return;
	}

	next();
}
export async function bearerAuthorization(req: Request, res: Response, next: NextFunction): Promise<void> {
	if (!req.headers.authorization) {
		res.send(401);
		return;
	}

	const [, token] = req.headers.authorization.split(' ');
	const userId = await jwtService.getUserIdByToken(token);

	if (userId) {
		const user = await usersQueryRepository.getById(userId);
		if (!user) {
			res.send(401);
			return;
		}

		req.userId = userId;
		next();
		return;
	}

	res.send(401);
}
