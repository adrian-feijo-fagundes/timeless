import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Group } from "./Group";
import { HabitCompletion } from "./HabitCompletion";

@Entity("habits") 
export class Habit{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.habits, { onDelete: "CASCADE"})
    user: User;

    @ManyToOne(() => Group, group => group.habits)
    group: Group;

    @OneToMany(() => HabitCompletion, completion => completion.habit)
    completions!: HabitCompletion[];

    @Column()
    title: string;

    @Column()
    topic: string;
    
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;


    @Column({ type: "int", default: 0 })
    current_streak?: number;

    @Column({ type: "int", default: 0 })
    longest_streak?: number;

    @Column({ type: "date", nullable: true })
    last_completed_at?: Date;

    
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