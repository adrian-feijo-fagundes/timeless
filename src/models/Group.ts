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

@Entity("groups")
export class Group {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title: string;

    @Column({ nullable: true, default: "" })
    description: string;

    @Column({ default: 2 })
    maxTasksPerDay: number;

    @Column("json", { default: [] })
    days: number[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Task, task => task.group)
    tasks!: Task[];

    @ManyToOne(() => User, user => user.groups, { onDelete: "CASCADE" })
    user: User;

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