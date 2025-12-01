import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Group } from "./Group";
import { HabitCompletion } from "./HabitCompletation";

@Entity("habits") 
export class Habit{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title: string;

    @Column()
    topic: string;
    
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, user => user.habits, { onDelete: "CASCADE"})
    user: User;

    @ManyToOne(() => Group, group => group.habits)
    group: Group;

    @Column({ type: "int", default: 0 })
    current_streak?: number;

    @Column({ type: "int", default: 0 })
    longest_streak?: number;

    @Column({ type: "date", nullable: true })
    last_completed_at?: Date;

    @OneToMany(() => HabitCompletion, completion => completion.habit)
    completions!: HabitCompletion[];
    
    constructor(
        user: User, 
        group: Group,
        title: string,
        topic: string,
    ) {
        this.user = user
        this.group = group
        this.title = title
        this.topic = topic || "Other"
    }
}