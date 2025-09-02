import { Group } from "../models/Group";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/dataSource";

export class GroupRepository {
    private repository: Repository<Group>;

    constructor() {
        this.repository = AppDataSource.getRepository(Group);
    }

    async create(data: Group): Promise<Group> {
        const group = this.repository.create(data);
        return await this.repository.save(group);
    }

    async findAll(): Promise<Group[]> {
        return await this.repository.find({
            relations: ['tasks', 'user']
        });
    }

    async findById(id: number): Promise<Group | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['tasks', 'user']
        });
    }

    async findByUserId(userId: number): Promise<Group[]> {
        return await this.repository.find({
            where: { user: { id: userId } },
            relations: ['tasks'],
            order: { priority: 'DESC', createdAt: 'DESC' }
        });
    }

    async update(id: number, data: Partial<Group>): Promise<void> {
        await this.repository.update(id, data);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async updateStats(id: number): Promise<void> {
        const group = await this.repository.findOne({
            where: { id },
            relations: ['tasks']
        });

        if (group) {
            const totalTasks = group.tasks.length;
            const completedTasks = group.tasks.filter(task => task.status === 'concluída').length;
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            await this.repository.update(id, {
                totalTasks,
                completedTasks,
                completionRate
            });
        }
    }
} 