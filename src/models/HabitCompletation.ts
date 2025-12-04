import { 
    Entity, PrimaryGeneratedColumn, Column, 
    ManyToOne, CreateDateColumn, Unique 
} from "typeorm";
import { Habit } from "./Habit";

@Entity("habit_completion")
@Unique(["habit", "completed_at"]) // evita duplicar o mesmo dia
export class HabitCompletion {

    @PrimaryGeneratedColumn()
    id!: string;

    @ManyToOne(() => Habit, habit => habit.completions, { onDelete: "CASCADE" })
    habit!: Habit;

    @Column({ type: "date" })
    completed_at: Date; // yyyy-mm-dd

    @CreateDateColumn()
    created_at!: Date;

    constructor(habit: Habit, completed_at: Date) {
        this.habit = habit;
        this.completed_at = completed_at;
    }
}
