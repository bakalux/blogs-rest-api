import { body } from 'express-validator';

export const loginValidation = body('login').isString().notEmpty().isLength({ min: 3, max: 10}).matches(/^[a-zA-Z0-9_-]*$/)
export const passwordValidation = body('password').isString().notEmpty().isLength({min: 6, max: 20})
export const emailValidation = body('email').isString().notEmpty().isEmail();
