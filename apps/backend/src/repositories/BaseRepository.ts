import { injectable, unmanaged } from "inversify";
import { Model, Document } from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository";

@injectable()
export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
    protected model: Model<T>;

    constructor(@unmanaged() model: Model<T>) {
        this.model = model;
    }

    async create(item: Partial<T>): Promise<T> {
        const newItem = new this.model(item);
        return await newItem.save();
    }

    async update(id: string, item: Partial<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, item, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        return !!result;
    }

    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id);
    }

    async findAll(filter: Record<string, unknown> = {}): Promise<T[]> {
        return await this.model.find(filter);
    }

    async findOne(filter: Record<string, unknown>): Promise<T | null> {
        return await this.model.findOne(filter);
    }

    async count(filter: Record<string, unknown> = {}): Promise<number> {
        return await this.model.countDocuments(filter);
    }
}
