import { CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity("tasks_log")
export class TaskLog {

    @ManyToOne(() => User, user => user.tasks, { onDelete: "CASCADE"})
    user: User;
    
    @ManyToOne(() => Task, task => task.tasksLog)
    task: Task;

    @CreateDateColumn()
    createdAt!: Date;
        
    constructor(
        user: User,
        task: Task
    ) {
        this.user = user
        this.task = task
    }
}