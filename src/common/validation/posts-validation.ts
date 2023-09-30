import { body } from 'express-validator';

import { BlogsQueryRepository } from '../../features/blogs/blogs-query-repository';

const blogsQueryRepository = new BlogsQueryRepository();

export const titleValidation = body('title').isString().trim().notEmpty().isLength({ max: 30 });
export const shortDescriptionValidation = body('shortDescription').trim().notEmpty().isString().isLength({ max: 100 });
export const contentValidation = body('content').isString().trim().notEmpty().isLength({max: 1000});
export const blogIdValidation = body('blogId').isString().trim().notEmpty().custom(async (value) => {
	const blog = await blogsQueryRepository.getById(value);

	if (!blog) {
		return Promise.reject('No such blog');
	}

	return Promise.resolve(true);
});
