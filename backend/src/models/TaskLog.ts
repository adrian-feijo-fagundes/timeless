import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity("tasks_log")
export class TaskLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.tasksLog, { onDelete: "CASCADE"})
    user: User;
    
    @ManyToOne(() => Task, task => task.tasksLog)
    task: Task;

    @Column()
    message: string;

    @CreateDateColumn()
    createdAt!: Date;
        
    constructor(
        user: User,
        task: Task,
        message: string
    ) {
        this.user = user
        this.task = task
        this.message = message
    }
}