import { PostInputModel, PostViewModel } from "../features/posts/posts-model";
import { IService } from "./iservice";
import { PostsRepository } from "../features/posts/posts-repository";
import { BlogsQueryRepository } from "../features/blogs/blogs-query-repository";

export class PostsService implements IService<PostViewModel, PostInputModel>{
    private _postsRepository = new PostsRepository();
    private _blogsQueryRepository = new BlogsQueryRepository();

    public async create(data: PostInputModel): Promise<PostViewModel> {
        const blog = await this._blogsQueryRepository.getById(data.blogId);

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
        const blog = await this._blogsQueryRepository.getById(data.blogId);

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
}
