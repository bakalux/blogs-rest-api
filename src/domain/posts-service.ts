import { PostInputModel, PostViewModel } from "../features/posts/posts-model";
import { IService } from "./iservice";
import { PostsRepository } from "../features/posts/posts-repository";
import { BlogsRepository } from "../features/blogs/blogs-repository";

export class PostsService implements IService<PostViewModel, PostInputModel>{
    private _postsRepository = new PostsRepository();
    private _blogsRepository = new BlogsRepository();

    public async getAll(): Promise<PostViewModel[]> {
        return this._postsRepository.getAll();
    }

    public async getById(id: string): Promise<PostViewModel | null> {
        return this._postsRepository.getById(id);
    }

    public async create(data: PostInputModel): Promise<PostViewModel> {
        const blog = await this._blogsRepository.getById(data.blogId);
		if (blog === null) {
			throw new Error("No such blog");
		}

		const date = new Date();
		const post = {
			...data,
			id: Math.floor(Math.random() * 1000).toString(),
			blogName: blog.name,
			createdAt: date.toISOString(),
		};

        return this._postsRepository.create(post);
    }

    public async updateById(id: string, data: PostInputModel): Promise<PostViewModel | null> {
        const blog = await this._blogsRepository.getById(data.blogId);

        if (blog === null) {
            return null;
        }

        return await this._postsRepository.updateById(id, data);
    }

    public async deleteById(id: string): Promise<boolean> {
        return this._postsRepository.deleteById(id);
    }

    public async deleteAll(): Promise<void> {
        await this._postsRepository.deleteAll();
    }

    public async isValidBlogId(blogId: string): Promise<boolean> {
        const blog = await this._blogsRepository.getById(blogId);

        return Boolean(blog);
    }
}
