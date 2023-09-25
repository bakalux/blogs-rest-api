import { PostInputModel, PostViewModel } from './posts-model';
import { IRepository } from '../../common/irepository';
import { BlogInputModel, BlogViewModel } from "../blogs/blogs-model";
import { blogsRepository } from "../blogs/blogs-repository";

class PostsRepository implements  IRepository<PostViewModel, PostInputModel>{
	private _posts: PostViewModel[] = [];
	private _blogsRepository: IRepository<BlogViewModel, BlogInputModel>;

	public constructor(blogsRepository: IRepository<BlogViewModel, BlogInputModel>) {
		this._blogsRepository = blogsRepository;
	}

	public async getAll(): Promise<PostViewModel[]> {
		return this._posts;
	}

	public async getById(id: string): Promise<PostViewModel | null> {
		const post = this._posts.find((post: PostViewModel) => post.id === id);

		if (!post) {
			return null;
		}

		return post;
	}

	public async create(data: PostInputModel): Promise<PostViewModel> {
		const blog = await this._blogsRepository.getById(data.blogId);
		if (blog === null) {
			throw new Error("No such blog");
		}

		const post = {
			...data,
			id: Math.floor(Math.random() * 1000).toString(),
			blogName: blog.name,
		};

		this._posts.push(post);

		return post;
	}

	public async updateById(id: string, data: PostInputModel): Promise<PostViewModel | null> {
		const index = this._posts.findIndex((post: PostViewModel) => post.id === id);

		if (index === -1) {
			return null;
		}

		const blog = await this._blogsRepository.getById(data.blogId);

		if (blog === null) {
			return null;
		}

		this._posts[index] = {
			...data,
			id: this._posts[index].id,
			blogName: blog.name,
		}

		return this._posts[index];
	}

	public async deleteById(id: string): Promise<boolean> {
		const index = this._posts.findIndex((post: PostViewModel) => post.id === id);

		if (index === -1) {
			return false;
		}

		this._posts = [...this._posts.slice(0, index), ...this._posts.slice(index + 1)];
		return true;
	}

	public async deleteAll(): Promise<void> {
		this._posts = [];
	}
}

export const postsRepository = new PostsRepository(blogsRepository);
