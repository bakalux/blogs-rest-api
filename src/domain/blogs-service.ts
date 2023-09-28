import { BlogInputModel, BlogViewModel } from "../features/blogs/blogs-model";
import { IService } from "./iservice";
import { BlogsRepository } from "../features/blogs/blogs-repository";

export class BlogsService implements IService<BlogViewModel, BlogInputModel>{
    private _blogsRepository = new BlogsRepository();

    public async create(data: BlogInputModel): Promise<BlogViewModel> {
        const date = new Date();
        const blog = {
            ...data,
            id: Math.floor(Math.random() * 1000).toString(),
            isMembership: false,
            createdAt: date.toISOString(),
        };

        return this._blogsRepository.create(blog);
    }

    public async updateById(id: string, data: BlogInputModel): Promise<BlogViewModel | null> {
        return this._blogsRepository.updateById(id, data);
    }

    public async deleteById(id: string): Promise<boolean> {
        return this._blogsRepository.deleteById(id);
    }

    public async deleteAll(): Promise<void> {
        await this._blogsRepository.deleteAll();
    }
}
