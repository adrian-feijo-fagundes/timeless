import { User } from "../models/User";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/dataSource";

export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async create(data: User): Promise<User> {
        const user = this.repository.create(data); // cria a instância, mas não salva
        const savedUser = await this.repository.save(user); // salva no banco
        return savedUser;
    }

    async findAll(): Promise<User[]> {
        return this.repository.find({
            // select: ["id", "name", "email"] // seleciona apenas campos necessários
        });
    }

    async findById(id: number): Promise<User | null> {
        return this.repository.findOne({
            where: { id },
            // select: ["id", "name", "email"]
        });
    }

    async update(id: number, data: User): Promise<void> {
        await this.repository.update(id, data);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
