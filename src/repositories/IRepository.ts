export interface IRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(opts?: { skip?: number; take?: number }): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}
