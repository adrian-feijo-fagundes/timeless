import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

import { Task } from "./Task";
import { User } from "./User";
import { Habit } from "./Habit";

@Entity("groups")
export class Group {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => Task, task => task.group)
    tasks!: Task[];

    @OneToMany(() => Habit, task => task.group)
    habits!: Habit[];

    @ManyToOne(() => User, user => user.groups, { onDelete: "CASCADE" })
    user: User;

    @Column()
    title: string;

    @Column({ nullable: true, default: "" })
    description: string;

    @Column({ default: 2 })
    maxTasksPerDay: number;

    @Column("json", { nullable: false })
    days: number[] = [];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;


    constructor(
        title: string,
        user: User,
        days?: number[],
        description?: string,
        maxTasksPerDay?: number,
    ) {
        this.title = title;
        this.user = user;
        this.days = days ?? [];
        this.description = description ?? '';
        this.maxTasksPerDay = maxTasksPerDay ?? 2;
    }
}