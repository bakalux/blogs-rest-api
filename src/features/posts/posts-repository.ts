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

	public getAll(): PostViewModel[] {
		return this._posts;
	}

	public getById(id: string): PostViewModel {
		const post = this._posts.find((post: PostViewModel) => post.id === id);

		if (!post) {
			throw new Error('No such post');
		}

		return post;
	}

	public create(data: PostInputModel): PostViewModel {
		const { name: blogName } = this._blogsRepository.getById(data.blogId);
		const post = {
			...data,
			id: Math.floor(Math.random() * 1000).toString(),
			blogName,
		};

		this._posts.push(post);

		return post;
	}

	public updateById(id: string, data: PostInputModel): PostViewModel {
		const index = this._posts.findIndex((post: PostViewModel) => post.id === id);

		if (index === -1) {
			throw new Error('No such post');
		}

		const { name: blogName } = this._blogsRepository.getById(data.blogId);

		this._posts[index] = {
			...data,
			id: this._posts[index].id,
			blogName,
		}

		return this._posts[index];
	}

	public deleteById(id: string): void {
		const index = this._posts.findIndex((post: PostViewModel) => post.id === id);

		if (index === -1) {
			throw new Error('No such blog');
		}

		this._posts = [...this._posts.slice(0, index), ...this._posts.slice(index + 1)]
	}

	public deleteAll(): void {
		this._posts = [];
	}
}

export const postsRepository = new PostsRepository(blogsRepository);
