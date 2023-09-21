import { PostInputModel, PostViewModel } from './posts-model';
import { IRepository } from '../../common/irepository';

class PostsRepository implements  IRepository<PostViewModel, PostInputModel>{
	private _posts: PostViewModel[] = [];

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
		const post = {
			...data,
			id: Math.floor(Math.random() * 1000).toString(),
			blogName: data.title + data.shortDescription,
		};

		this._posts.push(post);

		return post;
	}

	public updateById(id: string, data: PostInputModel): PostViewModel {
		const index = this._posts.findIndex((post: PostViewModel) => post.id === id);

		if (index === -1) {
			throw new Error('No such post');
		}

		this._posts[index] = {
			...data,
			id: this._posts[index].id,
			blogName: data.title + data.shortDescription,
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

export const postsRepository = new PostsRepository();
