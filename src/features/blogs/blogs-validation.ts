import { body } from 'express-validator';

export const nameValidation = body('name').isString().trim().notEmpty().isLength({ max: 15 });
export const descriptionValidation = body('description').isString().trim().notEmpty().isLength({ max: 500 });
export const urlValidation = body('websiteUrl').trim().notEmpty().isURL().isLength({ max: 100 });
