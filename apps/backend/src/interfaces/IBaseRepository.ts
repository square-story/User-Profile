export interface IBaseRepository<T> {
    create(item: Partial<T>): Promise<T>;
    update(id: string, item: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<T | null>;
    findAll(filter?: Record<string, unknown>): Promise<T[]>;
    findOne(filter: Record<string, unknown>): Promise<T | null>;
    count(filter?: Record<string, unknown>): Promise<number>;
}
