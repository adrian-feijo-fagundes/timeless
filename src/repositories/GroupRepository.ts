import { Group } from "../models/Group";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/dataSource";
import { GroupResponse } from "../types/GroupResponse";
import { UpdateGroupDTO } from "../dtos/groups/UpdateGroupDTO";

export class GroupRepository {
    private repository: Repository<Group>;

    constructor() {
        this.repository = AppDataSource.getRepository(Group);
    }

    async create(userId: number, data: Group): Promise<GroupResponse> {
        return await this.repository.save({
            data,
            user: { id: userId }
        });
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
            order: { createdAt: 'DESC' }
        });
    }

    async update(id: number, data: UpdateGroupDTO): Promise<void> {
        await this.repository.update(id, data);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
} 