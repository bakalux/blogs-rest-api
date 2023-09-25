import { Request, Response } from 'express';

import { IRepository } from './irepository';

export class Controller<TViewModel, TInputModel> {
	private _repository: IRepository<TViewModel, TInputModel>

	constructor(repository: IRepository<TViewModel, TInputModel>) {
		this._repository = repository;
	}


	public getAll = async (req: Request, res: Response): Promise<void> => {
		const data  = await this._repository.getAll();
		res.status(200).send(data);
	}

	public getOne = async (req: Request, res: Response): Promise<void> => {
		const item = await this._repository.getById(req.params.id);

		if (item === null) {
			res.status(404).send();
			return;
		}

		res.status(200).send(item);
	}

	public create = async (req: Request, res: Response): Promise<void> => {
		const data = req.body;
		const item = await this._repository.create(data);
		res.status(201).send(item);
	}

	public updateOne = async (req: Request, res: Response): Promise<void> => {
		const data = req.body;

			const blog = await this._repository.updateById(req.params.id, data);

			if (!blog) {
				res.status(404).send();
				return;
			}

			res.status(204).send();
	}

	public deleteOne = async (req: Request, res: Response): Promise<void> => {
		const isDeleted = await this._repository.deleteById(req.params.id);

		if(!isDeleted) {
			res.status(404).send();
			return;
		}

		res.status(204).send();
	}
}
