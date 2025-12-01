import { NotFoundError } from "../errors";
import { validateId } from "../utils/validateId";
import { TaskRepository } from "../repositories/TaskRepository";
import { TaskResponseDTO } from "../dtos/tasks/TaskResponseDTO";
import { UserUtils } from "../utils/UserUtils";
import { GroupRepository } from "../repositories/GroupRepository";
import { CreateTaskDTO } from "../dtos/tasks/CreateTaskDTO";
import { UpdateTaskDTO } from "../dtos/tasks/UpdateTaskDTO";

const taskRepository = new TaskRepository();
const groupRepository = new GroupRepository();

export class TaskService {

    async create(userId: number, data: CreateTaskDTO): Promise<TaskResponseDTO> {
        // garantir que o user existe
        await UserUtils.findUser(userId);

        // garantir que o grupo existe para esse user
        const group = await groupRepository.findById(data.groupId);
        if (!group) {
            throw new NotFoundError("Grupo não encontrado");
        }

        const task = await taskRepository.createTask({
            ...data,
            user: { id: userId } as any,
            group
        });

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

        // se quiser alterar o grupo
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
}
