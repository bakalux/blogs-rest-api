import { Request, Response, NextFunction } from 'express';
import { FieldValidationError, validationResult } from 'express-validator';

export function inputValidation(req: Request, res: Response, next: NextFunction): void {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(400).json({
			errorsMessages: (errors.array({ onlyFirstError: true }) as FieldValidationError[]).map((error: FieldValidationError) => ({
				message: error.msg,
				field: error.path,
			}))
		});
		return;
	}

	next();
}
