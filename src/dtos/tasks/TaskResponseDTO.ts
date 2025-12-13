import { Task } from "../../models/Task";
import { Group } from "../../models/Group";

export class TaskResponseDTO {
    id?: number;
    title?: string;
    topic?: string;
    limitDate?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
    completedAt?: Date | null;
    completedLate?: boolean;
    userId?: number;

    // Antes era apenas groupId, agora incluímos o objeto completo
    group?: {
        id: number;
        name: string;
        description?: string | null;
        color?: string | null;
        createdAt?: Date;
        updatedAt?: Date;
    } | null;

    status?: string;

    static fromEntity(task: Task): TaskResponseDTO {
        const dto = new TaskResponseDTO();

        dto.id = task.id;
        dto.title = task.title;
        dto.topic = task.topic;
        dto.status = task.status;
        dto.limitDate = task.limitDate ?? null;
        dto.createdAt = task.createdAt;
        dto.updatedAt = task.updatedAt;
        dto.completedAt = task.completedAt ?? null;
        dto.completedLate = task.completedLate ?? false;

        dto.userId = task.user?.id;

        // Aqui retornamos o objeto completo
        dto.group = task.group
            ? {
                id: task.group.id,
                name: task.group.title,
                description: task.group.description ?? null,
                createdAt: task.group.createdAt,
                updatedAt: task.group.updatedAt,
            }
            : null;

        return dto;
    }
}
