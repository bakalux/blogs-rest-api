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
		res.sendStatus(401);
		return;
	}

	const [authType , encoded] = req.headers.authorization.split(' ');

	if (authType !== 'Basic') {
		res.sendStatus(401);
		return;
	}
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
	if (req.method === 'GET' &&  req.originalUrl !== '/auth/me') {
		next();
		return;
	}

	if (!req.headers.authorization) {
		res.status(401).send({
			error: 'no data in authorization header',
		});
		return;
	}

	const [authType, token] = req.headers.authorization.split(' ');

	if (authType !== 'Bearer') {
		res.sendStatus(401);
		return;
	}

	const userId = await jwtService.getUserIdByToken(token);

	if (!userId) {
		res.status(401).send();
		return;
	}

	const user = await usersQueryRepository.getById(userId);

	if (!user) {
		res.status(401).send({
			error: `did not find user by userId ${userId} with token ${token}. Header is ${req.headers.authorization}`
		});
		return;
	}

	req.userId = userId;
	next();
}
