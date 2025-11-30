import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Group } from "./Group";
import { TaskLog } from "./TaskLog";

@Entity("tasks") 
export class Task{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title: string;

    @Column()
    topic: string;

    @Column()
    status: string;

    @Column({ type: "datetime",nullable: true})
    limitDate?: Date | null;
    
    @CreateDateColumn()
    createdAt!: Date;


    @UpdateDateColumn()
    updatedAt!: Date;
    
    @Column({ type: "datetime",nullable: true})
    completedAt?: Date;

    @Column({ type: "boolean", default: false })
    completedLate?: boolean;

    @ManyToOne(() => User, user => user.tasks, { onDelete: "CASCADE"})
    user: User;

    @ManyToOne(() => Group, group => group.tasks)
    group: Group;

    @OneToMany(() => TaskLog, tasksLog => tasksLog.task)
    tasksLog?: TaskLog[];
    
    constructor(
        user: User, 
        group: Group,
        title: string,
        topic: string,
        status: string,
        limitDate: Date,
        tasksLog: TaskLog[]
    ) {
        this.user = user
        this.group = group
        this.title = title
        this.topic = topic || "Other"
        this.status = status
        this.limitDate = limitDate
        this.tasksLog = tasksLog
    }
}