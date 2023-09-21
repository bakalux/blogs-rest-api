import { Request, Response } from 'express';

import { blogsRepository } from './blogs-repository';

class BlogsController {
	getAll(req: Request, res: Response): void {
		res.status(200).send(blogsRepository.getAll());
	}

	getOne(req: Request, res: Response): void {
		try {
			const blog = blogsRepository.getById(req.params.id);
			res.status(200).send(blog);
		} catch (e) {
			res.status(404).send();
		}
	}

	create(req: Request, res: Response): void {
		const data = req.body;
		const blog = blogsRepository.create(data);
		res.status(201).send(blog);
	}

	updateOne(req: Request, res: Response): void {
		const data = req.body;

		try {
			blogsRepository.updateById(req.params.id, data);
			res.status(204).send();
		} catch (e) {
			res.status(404).send();
		}
	}

	deleteOne(req: Request, res: Response): void {
		try {
			blogsRepository.deleteById(req.params.id);
			res.status(204).send();
		} catch (e) {
			res.status(404).send();
		}
	}
}

export const blogsController = new BlogsController();
