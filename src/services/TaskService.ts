import { NotFoundError } from "../errors";
import { validateId } from "../utils/validateId";
import { TaskRepository } from "../repositories/TaskRepository";
import { TaskResponseDTO } from "../dtos/tasks/TaskResponseDTO";
import { UserUtils } from "../utils/UserUtils";
import { GroupRepository } from "../repositories/GroupRepository";
import { CreateTaskDTO } from "../dtos/tasks/CreateTaskDTO";
import { UpdateTaskDTO } from "../dtos/tasks/UpdateTaskDTO";
import { GamificationService } from "./GamificationService";

const taskRepository = new TaskRepository();
const groupRepository = new GroupRepository();
const gamificationService = new GamificationService();

export class TaskService {

    async create(userId: number, data: CreateTaskDTO): Promise<TaskResponseDTO> {
        await UserUtils.findUser(userId);

        const group = await groupRepository.findById(data.groupId);
        if (!group) {
            throw new NotFoundError("Grupo não encontrado");
        }

        const task = await taskRepository.createTask({
            ...data,
            user: { id: userId } as any,
            group
        });

        // atualiza o contador de tarefas criadas na gamificação
        await gamificationService.incrementTasksCreated(userId);

        return TaskResponseDTO.fromEntity(task);
    }

    async findAll(userId: number): Promise<TaskResponseDTO[]> {
        await UserUtils.findUser(userId);

        const tasks = await taskRepository.findByUser(userId);
        return tasks.map(TaskResponseDTO.fromEntity);
    }

    async getById(userId: number, taskId: number): Promise<TaskResponseDTO> {
        validateId(taskId);
        await UserUtils.findUser(userId);

        const task = await taskRepository.findById(taskId);
        if (!task || task.user.id !== userId) {
            throw new NotFoundError("Tarefa não encontrada");
        }

        return TaskResponseDTO.fromEntity(task);
    }

    async update(userId: number, taskId: number, data: UpdateTaskDTO): Promise<TaskResponseDTO> {
        validateId(taskId);
        await UserUtils.findUser(userId);

        const task = await taskRepository.findById(taskId);
        if (!task || task.user.id !== userId) {
            throw new NotFoundError("Tarefa não encontrada");
        }

        // atualiza o grupo da tarefa se um novo grupo foi informado
        if (data.groupId) {
            const group = await groupRepository.findById(data.groupId);
            if (!group) throw new NotFoundError("Grupo não encontrado");
            task.group = group;
        }

        Object.assign(task, data);

        const updated = await taskRepository.save(task);
        return TaskResponseDTO.fromEntity(updated);
    }

    async delete(userId: number, taskId: number): Promise<void> {
        validateId(taskId);
        await UserUtils.findUser(userId);

        const task = await taskRepository.findById(taskId);
        if (!task || task.user.id !== userId) {
            throw new NotFoundError("Tarefa não encontrada");
        }

        await taskRepository.delete(taskId);
    }
    
    async findByGroup(userId: number, groupId: number): Promise<TaskResponseDTO[]> {
        validateId(groupId);
        await UserUtils.findUser(userId);
    
        const group = await groupRepository.findById(groupId);
        if (!group) {
            throw new NotFoundError("Grupo não encontrado");
        }
    
        // verifica se o grupo pertence ao usuário antes de retornar as tarefas
        if (group.user.id !== userId) {
            throw new NotFoundError("Grupo não encontrado");
        }
    
        const tasks = await taskRepository.findByGroup(groupId);
        return tasks.map(TaskResponseDTO.fromEntity);
    }

    // marca uma tarefa como completada e processa todos os aspectos da gamificação
    async completeTask(userId: number, taskId: number): Promise<{
        task: TaskResponseDTO;
        gamification: {
            xpGained: number;
            leveledUp: boolean;
            newLevel?: number;
            rewardXp?: number;
            streak: number;
            isNewStreakRecord: boolean;
        };
    }> {
        validateId(taskId);
        await UserUtils.findUser(userId);

        const task = await taskRepository.findById(taskId);
        if (!task || task.user.id !== userId) {
            throw new NotFoundError("Tarefa não encontrada");
        }

        if (task.status === "completed") {
            throw new NotFoundError("Tarefa já está completada");
        }

        const completedTask = await taskRepository.markAsCompleted(taskId);
        if (!completedTask) {
            throw new NotFoundError("Erro ao completar tarefa");
        }

        // processa XP, streak e conquistas relacionadas à tarefa completada
        const gamificationResult = await gamificationService.onTaskCompleted(userId);

        return {
            task: TaskResponseDTO.fromEntity(completedTask),
            gamification: gamificationResult
        };
    }
    
}
