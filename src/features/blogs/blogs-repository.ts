import { BlogInputModel, BlogViewModel } from './blogs-model';
import { IRepository } from '../../common/irepository';

class BlogsRepository implements  IRepository<BlogViewModel, BlogInputModel>{
	private _blogs: BlogViewModel[] = [];

	public getAll(): BlogViewModel[] {
		return this._blogs;
	}

	public getById(id: string): BlogViewModel {
		const blog = this._blogs.find((blog: BlogViewModel) => blog.id === id);

		if (!blog) {
			throw new Error('No such blog');
		}

		return blog;
	}

	public create(data: BlogInputModel): BlogViewModel {
		const blog = {
			...data,
			id: Math.floor(Math.random() * 1000).toString(),
		};

		this._blogs.push(blog);

		return blog;
	}

	public updateById(id: string, data: BlogInputModel): BlogViewModel {
		const index = this._blogs.findIndex((blog: BlogViewModel) => blog.id === id);

		if (index === -1) {
			throw new Error('No such blog');
		}

		this._blogs[index] = {
			id: this._blogs[index].id,
			...data,
		}

		return this._blogs[index];
	}

	public deleteById(id: string): void {
		const index = this._blogs.findIndex((blog: BlogViewModel) => blog.id === id);

		if (index === -1) {
			throw new Error('No such blog');
		}

		this._blogs = [...this._blogs.slice(0, index), ...this._blogs.slice(index + 1)]
	}

	public deleteAll(): void {
		this._blogs = [];
	}
}

export const blogsRepository = new BlogsRepository();
