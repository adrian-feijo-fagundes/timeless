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
    private async addTaskLog(task: Task, user: any, message: string): Promise<void> {
        const taskLog = this.taskLogRepository.create({
            task,
            user,
            message
        });
        await this.taskLogRepository.save(taskLog);
    }

    async create(data: Task): Promise<Task> {
        const task = this.repository.create(data);
        const savedTask = await this.repository.save(task);
        
        // Adicionar log de criação
        await this.addTaskLog(savedTask, data.user, "Criada");
        
        return savedTask;
    }

    async findAll(): Promise<Task[]> {
        return await this.repository.find({
            relations: ['user', 'group', 'tasksLog']
        });
    }

    async findById(id: number): Promise<Task | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['user', 'group', 'tasksLog']
        });
    }

    async findByUserId(userId: number): Promise<Task[]> {
        return await this.repository.find({
            where: { user: { id: userId } },
            relations: ['group', 'tasksLog'],
            order: { createdAt: 'DESC' }
        });
    }

    async findByGroupId(groupId: number): Promise<Task[]> {
        return await this.repository.find({
            where: { group: { id: groupId } },
            relations: ['user', 'tasksLog'],
            order: { createdAt: 'DESC' }
        });
    }

    async findByStatus(status: string, userId: number): Promise<Task[]> {
        return await this.repository.find({
            where: { 
                status,
                user: { id: userId }
            },
            relations: ['group', 'tasksLog'],
            order: { createdAt: 'DESC' }
        });
    }

    async findHabits(userId: number): Promise<Task[]> {
        return await this.repository.find({
            where: { 
                isHabit: true,
                user: { id: userId }
            },
            relations: ['group', 'tasksLog'],
            order: { createdAt: 'DESC' }
        });
    }

    async findTasks(userId: number): Promise<Task[]> {
        return await this.repository.find({
            where: { 
                isHabit: false,
                user: { id: userId }
            },
            relations: ['group', 'tasksLog'],
            order: { createdAt: 'DESC' }
        });
    }

    async update(id: number, data: Partial<Task>, user: any): Promise<void> {
        const task = await this.findById(id);
        if (!task) return;

        // Verificar quais campos foram alterados e criar mensagens simples
        const changes: string[] = [];
        
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

        // Atualizar a tarefa
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
        const task = await this.findById(id);
        if (!task) return;

        // Adicionar log antes de deletar
        await this.addTaskLog(task, user, "Excluída");
        
        await this.repository.delete(id);
    }

    async complete(id: number, user: any): Promise<void> {
        const task = await this.findById(id);
        if (!task) return;

        await this.repository.update(id, { 
            status: 'concluída',
            completedAt: new Date()
        });

        // Adicionar log de conclusão
        await this.addTaskLog(task, user, "Concluída");
    }

    async reschedule(id: number, newDate: Date, user: any): Promise<void> {
        const task = await this.findById(id);
        if (!task) return;

        await this.repository.update(id, { 
            limitDate: newDate,
            status: 'agendada'
        });

        // Adicionar log de reagendamento
        await this.addTaskLog(task, user, "Reagendada");
    }

    async start(id: number, user: any): Promise<void> {
        const task = await this.findById(id);
        if (!task) return;

        await this.repository.update(id, { 
            status: 'em_andamento'
        });

        // Adicionar log de início
        await this.addTaskLog(task, user, "Iniciada");
    }

    async pause(id: number, user: any): Promise<void> {
        const task = await this.findById(id);
        if (!task) return;

        await this.repository.update(id, { 
            status: 'pendente'
        });

        // Adicionar log de pausa
        await this.addTaskLog(task, user, "Pausada");
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

        return {
            total,
            completed,
            pending,
            overdue,
            completionRate
        };
    }

    // Método para buscar logs de uma tarefa específica
    async getTaskLogs(taskId: number): Promise<TaskLog[]> {
        return await this.taskLogRepository.find({
            where: { task: { id: taskId } },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }

    // Método para buscar logs de um usuário
    async getUserLogs(userId: number, limit?: number): Promise<TaskLog[]> {
        return await this.taskLogRepository.find({
            where: { user: { id: userId } },
            relations: ['task', 'task.group'],
            order: { createdAt: 'DESC' },
            take: limit || 50
        });
    }

    // Método para buscar logs por período
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