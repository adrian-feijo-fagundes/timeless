import { User } from "../models/User";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/dataSource";
import { UserResponse } from "../types/UserResponse";
export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    /**
     * Remove a senha do objeto usuário
     */
    private removePassword(user: User): UserResponse {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            birthday: user.birthday,
            tasks: user.tasks,
            groups: user.groups,
            tasksLog: user.tasksLog,
        } as UserResponse;
    }

    async create(data: User): Promise<UserResponse> {
        const user = this.repository.create(data);
        const savedUser = await this.repository.save(user);
        return this.removePassword(savedUser);
    }

    async findAll(): Promise<UserResponse[]> {
        const users = await this.repository.find();
        return users.map(user => this.removePassword(user));
    }

    async findById(id: number): Promise<UserResponse | null> {
        const user = await this.repository.findOne({ where: { id } });
        return user ? this.removePassword(user) : null;
    }

    async update(id: number, data: User): Promise<User> {
        const user = await this.repository.findOne({ where: { id } });

        if (!user) {
            throw new Error("UserNotFound");
        }

        Object.assign(user, data);
        return await this.repository.save(user);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    // Método para autenticação (retorna com senha)
    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOneBy({ email });
    }
    
}
