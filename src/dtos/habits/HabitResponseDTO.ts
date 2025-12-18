import { Habit } from "../../models/Habit";
import { HabitCompletion } from "../../models/HabitCompletion";

export class HabitResponseDTO {
    id!: number;
    title!: string;
    topic!: string;

    createdAt!: string;
    updatedAt!: string;

    current_streak!: number;
    longest_streak!: number;
    last_completed_at!: string | null;

    group!: {
        id: number;
        name: string;
    };

    completions!: {
        id: string;
        completed_at: Date;
    }[];

    static fromEntity(habit: Habit): HabitResponseDTO {
        const dto = new HabitResponseDTO();

        dto.id = habit.id;
        dto.title = habit.title;
        dto.topic = habit.topic;

        dto.createdAt = habit.createdAt.toISOString();
        dto.updatedAt = habit.updatedAt.toISOString();

        dto.current_streak = habit.current_streak ?? 0;
        dto.longest_streak = habit.longest_streak ?? 0;

        dto.last_completed_at = habit.last_completed_at
            ? habit.last_completed_at.toISOString().substring(0, 10)
            : null;

        dto.group = {
            id: habit.group.id,
            name: habit.group.title
        };

        dto.completions = habit.completions?.map((c: HabitCompletion) => ({
            id: c.id,
            completed_at: c.completed_at // já é yyyy-mm-dd
        })) || [];

        return dto;
    }
}
