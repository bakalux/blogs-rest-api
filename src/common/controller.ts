import { Request, Response } from 'express';

import { IRepository } from './irepository';

export class Controller<TViewModel, TInputModel> {
	private _repository: IRepository<TViewModel, TInputModel>

	constructor(repository: IRepository<TViewModel, TInputModel>) {
		this._repository = repository;
	}


	public getAll = (req: Request, res: Response): void => {
		res.status(200).send(this._repository.getAll());
	}

	public getOne = (req: Request, res: Response): void => {
		try {
			const item = this._repository.getById(req.params.id);
			res.status(200).send(item);
		} catch (e) {
			res.status(404).send();
		}
	}

	public create = (req: Request, res: Response): void => {
		const data = req.body;
		const item = this._repository.create(data);
		res.status(201).send(item);
	}

	public updateOne = (req: Request, res: Response): void => {
		const data = req.body;

		try {
			this._repository.updateById(req.params.id, data);
			res.status(204).send();
		} catch (e) {
			res.status(404).send();
		}
	}

	public deleteOne = (req: Request, res: Response): void => {
		try {
			this._repository.deleteById(req.params.id);
			res.status(204).send();
		} catch (e) {
			res.status(404).send();
		}
	}
}
