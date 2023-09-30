import { Request, Response, NextFunction } from 'express';

export function checkAuthorization(req: Request, res: Response, next: NextFunction): void {
	if (req.method === 'GET') {
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
