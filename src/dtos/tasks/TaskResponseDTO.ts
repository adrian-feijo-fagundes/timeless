import { Task } from "../../models/Task";

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
    groupId?: number;
    status?: string
    
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
        dto.groupId = task.group?.id;

        return dto;
    }
}
