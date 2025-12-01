import { Repository } from "typeorm";
import { Task } from "../models/Task";
import { AppDataSource } from "../config/dataSource";

export class TaskRepository {
    private repo: Repository<Task>;

    constructor() {
        this.repo = AppDataSource.getRepository(Task);
    }

    // ============================
    // CRUD BÁSICO
    // ============================

    async createTask(data: Partial<Task>): Promise<Task> {
        const task = this.repo.create(data);
        return await this.repo.save(task);
    }

    async findById(id: number): Promise<Task | null> {
        return await this.repo.findOne({
            where: { id },
            relations: ["user", "group", "tasksLog"]
        });
    }

    async save(task: Task): Promise<Task> {
        return await this.repo.save(task);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    // ============================
    // QUERIES ÚTEIS
    // ============================

    /** Todas as tasks de um usuário */
    async findByUser(userId: number): Promise<Task[]> {
        return await this.repo.find({
            where: { user: { id: userId } },
            relations: ["group", "tasksLog"]
        });
    }

    /** Todas as tasks de um grupo */
    async findByGroup(groupId: number): Promise<Task[]> {
        return await this.repo.find({
            where: { group: { id: groupId } },
            relations: ["user", "tasksLog"]
        });
    }

    
    /** Atualizar status + completedAt + completedLate */
    async markAsCompleted(taskId: number): Promise<Task | null> {
        const task = await this.findById(taskId);
        if (!task) return null;

        task.completedAt = new Date();

        if (task.limitDate && task.completedAt > task.limitDate) {
            task.completedLate = true;
        }

        task.status = "completed";

        return await this.repo.save(task);
    }
}
