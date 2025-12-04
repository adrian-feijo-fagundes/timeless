import { Repository } from "typeorm";
import { Habit } from "../models/Habit";
import { AppDataSource } from "../config/dataSource";
import { HabitCompletion } from "../models/HabitCompletation";

export class HabitRepository {
    private repo: Repository<Habit>;
    private completionRepo: Repository<HabitCompletion>;

    constructor() {
        this.repo = AppDataSource.getRepository(Habit);
        this.completionRepo = AppDataSource.getRepository(HabitCompletion);
    }

    async createHabit(data: Partial<Habit>): Promise<Habit> {
        const habit = this.repo.create(data);
        return await this.repo.save(habit);
    }

    async save(habit: Habit): Promise<Habit> {
        return await this.repo.save(habit);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    async findById(id: number): Promise<Habit | null> {
        return await this.repo.findOne({
            where: { id },
            relations: ["user", "group", "completions"]
        });
    }

    async findByUser(userId: number): Promise<Habit[]> {
        return await this.repo.find({
            where: { user: { id: userId } },
            relations: ["group", "completions"]
        });
    }

    async findByGroup(groupId: number): Promise<Habit[]> {
        return await this.repo.find({
            where: { group: { id: groupId } },
            relations: ["user", "completions"]
        });
    }

    // registra uma conclusão do hábito
    async registerCompletion(habitId: number, date: Date): Promise<Habit | null> {
        const habit = await this.findById(habitId);
        if (!habit) return null;

        // cria registro na tabela HabitCompletion
        const completion = this.completionRepo.create({
            habit,
            completed_at: date
        });
        await this.completionRepo.save(completion);

        // atualiza streaks
        const last = habit.last_completed_at
            ? new Date(habit.last_completed_at)
            : null;

        const isConsecutive =
            last &&
            new Date(last.setDate(last.getDate() + 1)).toDateString() ===
                date.toDateString();

        if (isConsecutive) {
            habit.current_streak = (habit.current_streak || 0) + 1;
        } else {
            habit.current_streak = 1;
        }

        if (!habit.longest_streak || habit.current_streak > habit.longest_streak) {
            habit.longest_streak = habit.current_streak;
        }

        habit.last_completed_at = date;

        return await this.repo.save(habit);
    }
}
