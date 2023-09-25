import { BlogInputModel, BlogViewModel } from './blogs-model';
import { IRepository } from '../../common/irepository';

class BlogsRepository implements  IRepository<BlogViewModel, BlogInputModel>{
	private _blogs: BlogViewModel[] = [];

	public async getAll(): Promise<BlogViewModel[]> {
		return this._blogs;
	}

	public async getById(id: string): Promise<BlogViewModel | null> {
		const blog = this._blogs.find((blog: BlogViewModel) => blog.id === id);

		if (!blog) {
			return null;
		}

		return blog;
	}

	public async create(data: BlogInputModel): Promise<BlogViewModel> {
		const blog = {
			...data,
			id: Math.floor(Math.random() * 1000).toString(),
		};

		this._blogs.push(blog);

		return blog;
	}

	public async updateById(id: string, data: BlogInputModel): Promise<BlogViewModel | null> {
		const index = this._blogs.findIndex((blog: BlogViewModel) => blog.id === id);

		if (index === -1) {
			return null;
		}

		this._blogs[index] = {
			id: this._blogs[index].id,
			...data,
		}

		return this._blogs[index];
	}

	public async deleteById(id: string): Promise<boolean> {
		const index = this._blogs.findIndex((blog: BlogViewModel) => blog.id === id);

		if (index === -1) {
			return false;
		}

		this._blogs = [...this._blogs.slice(0, index), ...this._blogs.slice(index + 1)];
		return true;
	}

	public async deleteAll(): Promise<void> {
		this._blogs = [];
	}
}

export const blogsRepository = new BlogsRepository();
