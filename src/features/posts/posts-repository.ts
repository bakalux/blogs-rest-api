import { PostInputModel, PostViewModel } from './posts-model';
import { IRepository } from '../../common/irepository';
import { BlogInputModel, BlogViewModel } from "../blogs/blogs-model";
import { blogsRepository } from "../blogs/blogs-repository";
import { getCollection } from "../../db";

class PostsRepository implements  IRepository<PostViewModel, PostInputModel>{
	private _collection = getCollection<PostViewModel>('posts');
	private _blogsRepository: IRepository<BlogViewModel, BlogInputModel>;

	public constructor(blogsRepository: IRepository<BlogViewModel, BlogInputModel>) {
		this._blogsRepository = blogsRepository;
	}

	public async getAll(): Promise<PostViewModel[]> {
		return await this._collection.find({},{ projection: { _id: false } }).toArray();
	}

	public async getById(id: string): Promise<PostViewModel | null> {
		const post = await this._collection.findOne({ id },{ projection: { _id: false } });

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
			id: Date.now().toString(),
			blogName: blog.name,
		};

		await this._collection.insertOne(post);

		return post;
	}

	public async updateById(id: string, data: PostInputModel): Promise<PostViewModel | null> {

		const blog = await this._blogsRepository.getById(data.blogId);

		if (blog === null) {
			return null;
		}


		const updating = {
			...data,
			id,
		};

		const result = await this._collection.updateOne({ id }, updating);

		if (result.matchedCount === 0) {
			return null;
		}

		return updating;
	}

	public async deleteById(id: string): Promise<boolean> {
		const result = await this._collection.deleteOne({ id });

		return result.deletedCount !== 0;
	}

	public async deleteAll(): Promise<void> {
		await this._collection.deleteMany();
	}
}

export const postsRepository = new PostsRepository(blogsRepository);
