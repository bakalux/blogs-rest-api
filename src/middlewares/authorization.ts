import { Request, Response, NextFunction } from 'express';

export function checkAuthorization(req: Request, res: Response, next: NextFunction): void {
	console.log('method', req.method);
	if (req.method === 'GET') {
		next();
		return;
	}

	if (!req.headers.authorization) {
		res.status(401).send();
		return;
	}

	const encoded = req.headers.authorization.replace('Basic_', '');

	const buff = new Buffer(encoded);

	const token = buff.toString('ascii');

	const [username, password] = token.split(':');
	console.log('username', username);
	console.log('password', password);

	if (username !== 'admin' || password !== 'qwerty') {
		res.status(401).send();
		return;
	}

	next();
}
