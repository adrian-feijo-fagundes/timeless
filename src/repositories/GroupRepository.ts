import { Group } from "../models/Group";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/dataSource";
import { GroupResponse } from "../dtos/groups/GroupResponse";
import { UpdateGroupDTO } from "../dtos/groups/UpdateGroupDTO";
import { CreateGroupDTO } from "../dtos/groups/CreateGroupDTO";

export class GroupRepository {
    private repository: Repository<Group>;

    constructor() {
        this.repository = AppDataSource.getRepository(Group);
    }

    async create(userId: number, dto: CreateGroupDTO): Promise<GroupResponse> {
        const group = await this.repository.save({
            ...dto,
            user: { id: userId }
        });

        return this.toResponse(group);
    }

    async findAll(): Promise<GroupResponse[]> {
        const groups = await this.repository.find();
        return groups.map(g => this.toResponse(g));
    }

    async findById(id: number): Promise<Group | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ["tasks", "user"]
        });
    }

    async findByUserId(userId: number): Promise<GroupResponse[]> {
        const groups = await this.repository.find({
            where: { user: { id: userId } },
            order: { createdAt: "DESC" }
        });

        return groups.map(g => this.toResponse(g));
    }

    async update(id: number, dto: UpdateGroupDTO): Promise<GroupResponse | null> {
        await this.repository.update(id, dto);

        const updated = await this.repository.findOne({ where: { id } });
        if (!updated) return null;

        return this.toResponse(updated);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    // Conversão mínima para resposta limpa
    private toResponse(group: Group): GroupResponse {
        return {
            id: group.id,
            title: group.title,
            description: group.description,
            maxTasksPerDay: group.maxTasksPerDay,
            days: group.days,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt
        };
    }
}
