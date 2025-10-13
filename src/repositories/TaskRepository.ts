import { Task } from "../models/Task";
import { TaskLog } from "../models/TaskLog";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/dataSource";

export class TaskRepository {
    private repository: Repository<Task>;
    private taskLogRepository: Repository<TaskLog>;

    constructor() {
        this.repository = AppDataSource.getRepository(Task);
        this.taskLogRepository = AppDataSource.getRepository(TaskLog);
    }

    /**
     * Adiciona um registro no TaskLog
     */
    private async addTaskLog(task: Task, user: any, message: string): Promise<void> {''
        const taskLog = this.taskLogRepository.create({ task, user, message });
        await this.taskLogRepository.save(taskLog);
    }

    /**
     * Busca tarefa com validação
     */
    private async findTaskWithValidation(id: number): Promise<Task | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['user', 'group', 'tasksLog']
        });
    }

    /**
     * Atualiza tarefa com log automático
     */
    private async updateWithLog(id: number, data: Partial<Task>, user: any, logMessage: string): Promise<void> {
        const task = await this.findTaskWithValidation(id);
        if (!task) return;

        await this.repository.update(id, data);
        await this.addTaskLog(task, user, logMessage);
    }

    /**
     * Busca tarefas com filtros
     */
    private async findTasksWithFilters(filters: any, relations: string[] = ['group', 'tasksLog']): Promise<Task[]> {
        return await this.repository.find({
            where: filters,
            relations,
            order: { createdAt: 'DESC' }
        });
    }

    // ========== MÉTODOS PÚBLICOS ==========

    async create(data: Task): Promise<Task> {
        const task = this.repository.create(data);
        const savedTask = await this.repository.save(task);
        await this.addTaskLog(savedTask, data.user, "Criada");
        return savedTask;
    }

    async findAll(): Promise<Task[]> {
        return await this.repository.find({
            relations: ['user', 'group', 'tasksLog']
        });
    }

    async findById(id: number): Promise<Task | null> {
        return await this.findTaskWithValidation(id);
    }

    async findByUserId(userId: number): Promise<Task[]> {
        return await this.findTasksWithFilters({ user: { id: userId } });
    }

    async findByGroupId(groupId: number): Promise<Task[]> {
        return await this.findTasksWithFilters({ group: { id: groupId } }, ['user', 'tasksLog']);
    }

    async findByStatus(status: string, userId: number): Promise<Task[]> {
        return await this.findTasksWithFilters({ 
            status,
            user: { id: userId }
        });
    }

    async findHabits(userId: number): Promise<Task[]> {
        return await this.findTasksWithFilters({ 
            isHabit: true,
            user: { id: userId }
        });
    }

    async findTasks(userId: number): Promise<Task[]> {
        return await this.findTasksWithFilters({ 
            isHabit: false,
            user: { id: userId }
        });
    }

    async update(id: number, data: Partial<Task>, user: any): Promise<void> {
        const task = await this.findTaskWithValidation(id);
        if (!task) return;

        // Detectar mudanças e criar logs
        const changes = this.detectChanges(task, data);
        
        await this.repository.update(id, data);

        // Adicionar logs para cada mudança
        if (changes.length > 0) {
            for (const change of changes) {
                await this.addTaskLog(task, user, change);
            }
        } else {
            await this.addTaskLog(task, user, "Atualizada");
        }
    }

    async delete(id: number, user: any): Promise<void> {
        const task = await this.findTaskWithValidation(id);
        if (!task) return;

        await this.addTaskLog(task, user, "Excluída");
        await this.repository.delete(id);
    }

    async complete(id: number, user: any): Promise<void> {
        await this.updateWithLog(id, { 
            status: 'concluída',
            completedAt: new Date()
        }, user, "Concluída");
    }

    async reschedule(id: number, newDate: Date, user: any): Promise<void> {
        await this.updateWithLog(id, { 
            limitDate: newDate,
            status: 'agendada'
        }, user, "Reagendada");
    }

    async start(id: number, user: any): Promise<void> {
        await this.updateWithLog(id, { status: 'em_andamento' }, user, "Iniciada");
    }

    async pause(id: number, user: any): Promise<void> {
        await this.updateWithLog(id, { status: 'pendente' }, user, "Pausada");
    }

    /**
     * Detecta mudanças entre o objeto atual e os novos dados
     */
    private detectChanges(task: Task, data: Partial<Task>): string[] {
        const changes: string[] = [];
        
        // Verificar mudanças específicas
        if (data.title && data.title !== task.title) {
            changes.push("Título alterado");
        }
        
        if (data.topic && data.topic !== task.topic) {
            changes.push("Tópico alterado");
        }
        
        if (data.status && data.status !== task.status) {
            changes.push(`Status: ${data.status}`);
        }
        
        if (data.limitDate && data.limitDate !== task.limitDate) {
            changes.push("Data alterada");
        }
        
        if (data.isHabit !== undefined && data.isHabit !== task.isHabit) {
            changes.push(data.isHabit ? "Tipo: Hábito" : "Tipo: Tarefa");
        }

        return changes;
    }

    async getStatsByUser(userId: number): Promise<{
        total: number;
        completed: number;
        pending: number;
        overdue: number;
        completionRate: number;
    }> {
        const tasks = await this.findByUserId(userId);
        const total = tasks.length;
        const completed = tasks.filter(task => task.status === 'concluída').length;
        const pending = tasks.filter(task => task.status === 'pendente').length;
        const overdue = tasks.filter(task => 
            task.limitDate && 
            new Date(task.limitDate) < new Date() && 
            task.status !== 'concluída'
        ).length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { total, completed, pending, overdue, completionRate };
    }

    // Métodos para logs
    async getTaskLogs(taskId: number): Promise<TaskLog[]> {
        return await this.taskLogRepository.find({
            where: { task: { id: taskId } },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }

    async getUserLogs(userId: number, limit?: number): Promise<TaskLog[]> {
        return await this.taskLogRepository.find({
            where: { user: { id: userId } },
            relations: ['task', 'task.group'],
            order: { createdAt: 'DESC' },
            take: limit || 50
        });
    }

    async getLogsByPeriod(userId: number, startDate: Date, endDate: Date): Promise<TaskLog[]> {
        return await this.taskLogRepository
            .createQueryBuilder('taskLog')
            .leftJoinAndSelect('taskLog.task', 'task')
            .leftJoinAndSelect('task.group', 'group')
            .where('taskLog.user.id = :userId', { userId })
            .andWhere('taskLog.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
            .orderBy('taskLog.createdAt', 'DESC')
            .getMany();
    }
} 