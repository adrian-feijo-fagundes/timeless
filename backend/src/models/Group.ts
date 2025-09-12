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

    @Column({ default: "#3B82F6" })
    color: string;

    @Column({
        type: 'enum',
        enum: ['active', 'archived', 'paused'],
        default: 'active'
    })
    status: string;

    @Column({ default: true })
    isVisible: boolean;

    @Column({ default: 10 })
    maxTasksPerDay: number;

    @Column({ default: true })
    sendNotifications: boolean;

    @Column({ default: 0 })
    totalTasks: number;

    @Column({ default: 0 })
    completedTasks: number;

    @Column({ default: 0 })
    completionRate: number;

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
        color?: string,
        maxTasksPerDay?: number,
        sendNotifications?: boolean,
    ) {
        this.title = title;
        this.user = user;
        this.days = days ?? [1, 2, 3, 4, 5]; // Segunda a sexta por padrão
        this.description = description ?? '';
        this.color = color ?? '#3B82F6'; // Azul padrão
        this.maxTasksPerDay = maxTasksPerDay ?? 10; // 10 tarefas por dia
        this.sendNotifications = sendNotifications ?? true;
        
        // Valores padrão para estatísticas
        this.totalTasks = 0;
        this.completedTasks = 0;
        this.completionRate = 0;
        this.status = 'active';
        this.isVisible = true;
    }
}