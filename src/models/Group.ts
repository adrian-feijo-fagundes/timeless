import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
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

    @Column("json")
    days: number[];

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => Task, task => task.group)
    tasks!: Task[];

    @ManyToOne(() => User, user => user.groups, { onDelete: "CASCADE"})
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
        this.days = days ?? [1, 2, 3, 4, 5]; // Segunda a sexta por padrão
        this.description = description ?? '';
        this.maxTasksPerDay = maxTasksPerDay ?? 2; // 10 tarefas por dia    
    }
}